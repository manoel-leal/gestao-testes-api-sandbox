const faker = require('faker');

faker.locale = 'pt_BR';

var nomeDoUsuario = faker.name.firstName();
var sobrenomeDoUsuario = faker.name.lastName()

function userBuilder({
  username = "",
  senha = "",
  nome = "",
  sobrenome = "",
  role = null
} = {}) {
  return {
    username,
    senha,
    nome,
    sobrenome,
    role
  };
}

function userBuilderLider({
  username = `${nomeDoUsuario}.${sobrenomeDoUsuario}`, 
  senha = "Sistema1234" ,
  nome = nomeDoUsuario,
  sobrenome = sobrenomeDoUsuario,
  role = "LIDER"
} = {}) {
  return {
    username,
    senha,
    nome,
    sobrenome,
    role
  };
}

function userBuilderAnalista({
  username = `${nomeDoUsuario}.${sobrenomeDoUsuario}`, 
  senha = "Sistema1234" ,
  nome = nomeDoUsuario,
  sobrenome = sobrenomeDoUsuario,
  role = "ANALISTA"
} = {}) {
  return {
    username,
    senha,
    nome,
    sobrenome,
    role
  };
}

function userBuilderTestador({
  username = `${nomeDoUsuario}.${sobrenomeDoUsuario}`, 
  senha = "Sistema1234" ,
  nome = nomeDoUsuario,
  sobrenome = sobrenomeDoUsuario,
  role = "TESTADOR"
} = {}) {
  return {
    username,
    senha,
    nome,
    sobrenome,
    role
  };
}


module.exports = { userBuilder, userBuilderLider, userBuilderAnalista, userBuilderTestador };