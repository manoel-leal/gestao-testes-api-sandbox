const request = require("supertest");
const { BASE_URL, PATHS } = require("../config/urls");
const { gerarToken } = require("./auth");
const faker = require('faker');

faker.locale = 'pt_BR';

async function gerarUsuario(username, senha, nome, sobrenome, role) {
  const token = await gerarToken("admin", "admin");

  const resposta = await request(BASE_URL)
    .post(PATHS.USUARIOS)
    .send({ username, senha, nome, sobrenome, role })
    .set("Authorization", token);

  const { username: userResp } = resposta.body;

  return { username: userResp, senha };
}

async function gerarUsuarioComRole(role) {
  const nome = faker.name.firstName();
  const sobrenome = faker.name.lastName();
  const username = `${nome}.${sobrenome}`;
  const senha = "Sistema1234";

  const resposta = await gerarUsuario(username, senha, nome, sobrenome, role);
  return resposta;
}

module.exports = { gerarUsuarioComRole };