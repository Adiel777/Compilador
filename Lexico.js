const fs = require('fs');
const texto = fs.readFileSync('fonte.txt', 'utf-8');
let token = '';
let simbolos_especiais  = '';
let simbolo_especial = '';
let digito = '';
let estado = 0;
let simbolosEspecias  = [];
let digitoS = [];
let Identificadores = [];
let palavrasReservadas = [];
let sequencia = [];
let comentarios = [];
let comentario = '';
const palavras_Reservadas = ['program', 'if', 'then', 'else', 'while', 'do', 'until', 'repeat', 'int', 'double', 'case', 'switch', 'end', 'procedure', 'function', 'for', 'begin'];

for (let i = 0; i < texto.length; i++) {    
  if(simbolo_especial !== ''){
    console.log(simbolo_especial + " -> Símbolo Especial");
    simbolosEspecias.push(simbolo_especial);
    sequencia.push(simbolo_especial);
    simbolo_especial  = '';
    estado = 0;
  }
  if(texto[i] === " " || texto[i] === "\t" || texto[i].match(/[\r\n]/)){
    if(comentario !== ''){
        comentario+=texto[i];
        if(estado === 12 || estado === 15){
            console.log(comentario + " -> Comentario");
            comentarios.push(comentario);
            comentario = '';
        }
        if(comentario.startsWith('@@') && comentario.endsWith('\r\n')){
            estado = 0;
            comentarios.push(comentario);
            comentario = '';
        }
    }else{
        if(token !== ''){//verifica se o token não ta vazio
            if(palavras_Reservadas.includes(token)){
                palavrasReservadas.push(token);
                sequencia.push(token);
                console.log(token + " -> Palavra Reservada");
            }else{
                Identificadores.push(token);
                sequencia.push(token);
                console.log(token + " -> Identificador");
            }
            token = '';
        }

        if(simbolos_especiais !== ''){
            console.log(simbolos_especiais + " -> Símbolo Especial");
            simbolosEspecias.push(simbolos_especiais);
            sequencia.push(simbolos_especiais);
            simbolos_especiais  = '';
        }

        if(digito !== ''){//verifica se o digito não ta vazio
            console.log(digito+ " -> Digito");
            digitoS.push(digito);
            sequencia.push(digito);
            digito = '';
        }
        estado = 0;
    }
    
  }else{
    switch (estado) {
      case 0:
          if (texto[i].match(/[a-zA-Z]/)) {
              token += texto[i];
              estado = 1;
          } else if (texto[i].match(/[0-9]/)) {
              digito += texto[i];
              estado = 19;
              if(i + 1 < texto.length && texto[i + 1].match(/[^,0-9]/)){
                digitoS.push(digito);
                sequencia.push(digito);
                digito = '';
                estado = 0;
              }
          } else if (texto[i].match(/[-]/) && (i + 1 < texto.length && texto[i + 1].match(/[0-9]/))) {
              digito += texto[i];
              estado = 21;
          } else if (texto[i].match(/[@]/) && texto[i + 1] === '@') {
              comentario+=texto[i];
              estado = 16;
          } else if (texto[i].match(/[/]/) && (texto[i + 1] === '/' || texto[i + 1] === '*')) {
              comentario+=texto[i];
              estado = 9;
          } else if (texto[i].match(/[<]/)) {
              simbolos_especiais+=texto[i];
              estado = 4
          } else if (texto[i].match(/[:=!>]/) && i + 1 < texto.length && texto[i + 1].match(/[=]/)) {
              simbolos_especiais+=texto[i];
              estado = 6;
          } else if (texto[i].match(/[/:=;,.+*@()<>}{-]/)) {
              simbolo_especial=texto[i];
              estado = 8;
              if(i + 1 < texto.length && texto[i + 1].match(/[^/:=;,.+*@()<>}{-]/)){
                simbolosEspecias.push(simbolo_especial);
                sequencia.push(simbolo_especial);
                simbolo_especial  = '';
                estado = 0;
              }
          } else {
            estado = null;
          }
          break;
      case 1:
          if (texto[i].match(/[a-zA-Z0-9]/)) {
              token += texto[i];
              estado = 3;
          } else if (texto[i] === '_' || texto[i] === '$') {
              token += texto[i];
              estado = 2;
          } else {
            estado = null;
          }
          break;
      case 2:
          if (texto[i].match(/[a-zA-Z0-9]/)) {
              token += texto[i];
              estado = 3;
          } else {
              estado = null;
          }
          break;
      case 3:
          if (texto[i].match(/[a-zA-Z0-9]/)) {
              token += texto[i];
              estado = 3;
              if(i + 1 < texto.length && texto[i + 1].match(/[^a-zA-Z0-9]/) || i === texto.length - 1){
                if(palavras_Reservadas.includes(token)){
                    palavrasReservadas.push(token);
                    sequencia.push(token);
                }else{
                    Identificadores.push(token);
                    sequencia.push(token);
                }
                token = '';
                if(i === texto.length - 1){
                    estado = 3;
                }else{
                    estado = 0;
                }
              }
          }else{
              estado = null;
          }
          break;
      case 4:
          if (texto[i].match(/[=>]/)) {
              simbolos_especiais+=texto[i];
              estado = 5;
              if(i + 1 < texto.length && texto[i + 1].match(/[^=>]/)){
                simbolosEspecias.push(simbolos_especiais);
                sequencia.push(simbolos_especiais);
                simbolos_especiais  = '';
                estado = 0;
              }
          }else{
              estado = null;
          }
          break;
      case 6:
          if (texto[i].match(/[=]/)) {
              simbolos_especiais+=texto[i];
              estado = 7;
              if(i + 1 < texto.length && texto[i + 1].match(/[^=>]/)){
                simbolosEspecias.push(simbolos_especiais);
                sequencia.push(simbolos_especiais);
                simbolos_especiais  = '';
                estado = 0;
              }
          } else {
              estado = null;
          }
          break;
      case 9:
          if (texto[i].match(/[/]/)) {
              comentario+=texto[i];
              estado = 10;
          } else if (texto[i].match(/[*]/)) {
              comentario+=texto[i];
              estado = 13;
          } else {
              estado = null;
          }
          break;
      case 10:
          if (texto[i].match(/[/]/)) { // se for barra
              comentario+=texto[i];
              estado = 11;
          } else {
              comentario+=texto[i];
              estado = 10;
          }
          break;
      case 11:
          if (texto[i].match(/[/]/)) { // se for barra
              comentario+=texto[i];
              estado = 12;
          } else {
              comentario+=texto[i];
              estado = 10;
          }
          break;
      case 13:
          if (texto[i].match(/[*]/)) { // se for *
              comentario+=texto[i];
              estado = 14;
          } else {
              comentario+=texto[i];
              estado = 13;
          }
          break;
      case 14:
          if (texto[i].match(/[/]/)) { // se for /
              comentario+=texto[i];
              estado = 15;
          } else {
              comentario+=texto[i];
              estado = 13;
          }
          break;
      case 16:
          if (texto[i].match(/[@]/)) { // se for @
              comentario+=texto[i];
              estado = 17;
          } else {
              estado = null;
          }
          break;
      case 17:
          if (texto[i] === '\n') { // se for \n
              estado = 18;
          } else {
              estado = 17;
          }
          comentario+=texto[i];
          break;
      case 19:
          if (texto[i].match(/[0-9]/)) {
              digito += texto[i];
              estado = 19;
          } else if (texto[i].match(/[,]/) && i + 1 < texto.length && texto[i + 1].match(/[0-9]/)) {
              digito += texto[i];
              estado = 20;
          } else{
              estado = null;
          }
          break;
      case 20:
          if (texto[i].match(/[0-9]/)) {
              digito += texto[i];
              estado = 22;
          }else {
              estado = null;
          }
          break;
      case 21:
          if (texto[i].match(/[0-9]/)) {
              digito += texto[i];
              estado = 19;
          } else {
              estado = null;
          }
          break;
      case 22:
          if (texto[i].match(/[0-9]/)) {
              digito += texto[i];
              estado = 22;
              if(i + 1 < texto.length && texto[i + 1].match(/[^0-9]/)){
                digitoS.push(digito);
                sequencia.push(digito);
                digito = '';
                estado = 0;
              }
          } else {
            estado = null;
          }
        break;
    }
  }
  if (estado === null) {
    console.log('O código-fonte está incorreto');
    process.exit(1);
  }


}
console.log(estado)

if (estado === 1 || estado === 3 || estado === 4 || estado === 5 ||
    estado === 6 || estado === 7  || estado === 8 || estado === 12 || estado === 15 || 
    estado === 18 || estado === 19 || estado === 22) {
    //valores da ultima posicao
    if (token !== '' && !palavras_Reservadas.includes(token)) {
      console.log(token + " -> Identificador");
      sequencia.push(token);
      Identificadores.push(token);
    }
    if (palavrasReservadas.includes(token)) {
      console.log(token + " -> Palavra Reservada");
      sequencia.push(token);
      palavrasReservadas.push(token);
    }
    if (digito !== '') {
      console.log(digito + " -> Digito");
      sequencia.push(digito);
      digitoS.push(digito);
    }
    if (simbolos_especiais !== '') {
      console.log(simbolos_especiais + " -> Símbolo Especial");
      sequencia.push(simbolos_especiais);
      simbolosEspecias.push(simbolos_especiais);
    }
    if(simbolo_especial !== ''){
        console.log(simbolo_especial + " -> Símbolo Especial");
        sequencia.push(simbolo_especial);
        simbolosEspecias.push(simbolo_especial);
    }
    
    if (comentario !== '') {
      console.log(comentario + " -> Comentário");
      comentarios.push(comentario);
    }
    console.log("COMENTÁRIOS:")
    console.log(comentarios)
    console.log("IDENTIFICADORES:")
    console.log(Identificadores)
    console.log("PALAVRAS RESERVADAS:")
    console.log(palavrasReservadas)
    console.log("DÍGITOS:")
    console.log(digitoS)
    console.log("SÍMBOLOS ESPECIAIS:")
    console.log(simbolosEspecias)
    console.log("\n")
    console.log("SEQUÊNCIA:")
    console.log(sequencia)
  } else {
    console.log("Estado final incorreto");
    process.exit(1);
  }