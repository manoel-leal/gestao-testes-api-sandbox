const request = require("supertest");
const { BASE_URL, PATHS } = require("../config/urls");

async function gerarToken(username, senha) {
  const resposta = await request(BASE_URL)
    .post(PATHS.LOGIN)
    .send({ username, senha });

  console.log("username: ", username)
  console.log("senha: ", senha)
  console.log("Status:", resposta.statusCode);
  console.log("Body:", resposta.body);


  if (!resposta.body.token) {
    throw new Error("Token não retornado pelo servidor");
  }

  return "Bearer " + resposta.body.token;
}

module.exports = { gerarToken };