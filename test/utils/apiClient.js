const request = require("supertest");
const { logRequestResponse } = require("./logger"); // ajuste o caminho conforme sua estrutura

async function get(baseUrl, path, token) {
  const response = await request(baseUrl).get(path).set("Authorization", token);
  logRequestResponse({ url: `${baseUrl}${path}`, headers: { Authorization: token }, body: null }, response);
  return response;
}

async function getById(baseUrl, path, token, id) {
  const response = await request(baseUrl).get(path + "/" + id).set("Authorization", token);
  logRequestResponse({ url: `${baseUrl}${path}`, headers: { Authorization: token }, body: null }, response);
  return response;
}

async function post(baseUrl, path, body, token) {
  const response = await request(baseUrl).post(path).set("Authorization", token).send(body);
  logRequestResponse({ url: `${baseUrl}${path}`, headers: { Authorization: token }, body }, response);
  return response;
}

async function put(baseUrl, path, body, token, id) {
  const response = await request(baseUrl).put(`${path}/${id}`).set("Authorization", token).send(body);
  logRequestResponse({ url: `${baseUrl}${path}/${id}`, headers: { Authorization: token }, body }, response);
  return response;
}

async function del(baseUrl, path, token, id) {
  const response = await request(baseUrl).delete(`${path}/${id}`).set("Authorization", token);
  logRequestResponse({ url: `${baseUrl}${path}/${id}`, headers: { Authorization: token }, body: null }, response);
  return response;
}

module.exports = { get, getById, post, put, del };