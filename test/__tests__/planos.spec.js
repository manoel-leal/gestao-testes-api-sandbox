const { BASE_URL, PATHS } = require("../config/urls");
const { gerarToken } = require("../utils/auth");
const { gerarUsuarioComRole } = require("../utils/userGenerator")
const { get, getById, post, put, del } = require("../utils/apiClient");
const { planoBuilder } = require("../builders/planoBuilder");
const { validateResponseWithSchema } = require("../utils/schemaValidator");

describe("Suite - Manter Plano de Testes", () => {
  let token;
  let tokenRoleAnalista;
  let tokenRoleTestador;

  beforeAll(async () => {
    const usuario = await gerarUsuarioComRole("LIDER");
    token = await gerarToken(usuario.username, usuario.senha);
    const usuarioAnalista = await gerarUsuarioComRole("ANALISTA");
    tokenRoleAnalista = await gerarToken(usuarioAnalista.username, usuarioAnalista.senha);
    const usuarioTestador = await gerarUsuarioComRole("TESTADOR");
    tokenRoleTestador = await gerarToken(usuarioTestador.username, usuarioTestador.senha);
  });

  it("Deve listar planos de teste com sucesso", async () => {
    const resposta = await get(BASE_URL, PATHS.PLANOS, token);

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.length).toBeGreaterThan(0);
  });

  it("Deve criar plano de teste com sucesso", async () => {
    const planoDeTeste = planoBuilder();

    const resposta = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);

    expect(resposta.statusCode).toBe(201);
    validateResponseWithSchema("schemas/criarPlano.json", resposta.body);
  });

  it("Não deve criar plano de teste com token inválido", async () => {
    const planoDeTeste = planoBuilder();

    const resposta = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, "12345");

    expect(resposta.statusCode).toBe(401);
    expect(resposta.body.message).toBe("Token inválido.");
  });

  it("Não deve criar plano de teste sem preencher o titulo", async () => {
    const planoDeTeste = planoBuilder({
      titulo: null
    });

    const resposta = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);

    expect(resposta.statusCode).toBe(400);
    expect(resposta.body.message).toBe("notNull Violation: Plano.titulo cannot be null");
  });

  it("Não deve criar plano de teste sem preencher a descrição", async () => {
    const planoDeTeste = planoBuilder({
      descricao: null
    });

    const resposta = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);

    expect(resposta.statusCode).toBe(400);
    expect(resposta.body.message).toBe("notNull Violation: Plano.descricao cannot be null");
  });

  it("Não deve criar plano de teste sem preencher com role sem permissão - Testador", async () => {
    const planoDeTeste = planoBuilder();

    const resposta = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, tokenRoleTestador);

    expect(resposta.statusCode).toBe(403);
    expect(resposta.body.message).toBe("Acesso negado.");
  });

    it("Não deve criar plano de teste sem preencher com role sem permissão - Analisa", async () => {
    const planoDeTeste = planoBuilder();

    const resposta = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, tokenRoleAnalista);

    expect(resposta.statusCode).toBe(403);
    expect(resposta.body.message).toBe("Acesso negado.");
  });

  it("Deve consultar plano de teste por id com sucesso", async () => {
    const planoDeTeste = planoBuilder();

    const resposta = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(resposta.statusCode).toBe(201);
    const planoId = resposta.body.id;

    const respostaConsulta = await getById(BASE_URL, PATHS.PLANOS, token, planoId);
    expect(respostaConsulta.statusCode).toBe(200);
    expect(respostaConsulta.body.id).toBe(planoId);
    validateResponseWithSchema("schemas/consultarPlano.json", respostaConsulta.body);
  });

  it("Não deve consultar plano com id inválido", async () => {
    const planoIdInexistente = "2c514543-f8dd-4729-8637-26a7f9d5710f";

    const respostaConsulta = await getById(BASE_URL, PATHS.PLANOS, token, planoIdInexistente);
    expect(respostaConsulta.statusCode).toBe(404);
    expect(respostaConsulta.body.message).toBe("Plano não encontrado.");
  });

  it("Deve alterar plano de teste com sucesso", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const tituloAlterado = "Plano de teste alterado";
    const descricaoAlterada = "Validar o comportamento da funcionalidade de alterar plano de testes";

    const planoDeTesteAlterado = planoBuilder({
      titulo: tituloAlterado,
      descricao: descricaoAlterada
    });

    const resposta = await put(BASE_URL, PATHS.PLANOS, planoDeTesteAlterado, token, id);
    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.titulo).toBe(tituloAlterado);
    expect(resposta.body.descricao).toBe(descricaoAlterada);
    validateResponseWithSchema("schemas/criarPlano.json", resposta.body);
  });

   it("Não deve alterar plano de teste com token inválido", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const tituloAlterado = "Plano de teste alterado";
    const descricaoAlterada = "Validar o comportamento da funcionalidade de alterar plano de testes";

    const planoDeTesteAlterado = planoBuilder({
      titulo: tituloAlterado,
      descricao: descricaoAlterada
    });

    const resposta = await put(BASE_URL, PATHS.PLANOS, planoDeTesteAlterado, "12345", id);
    expect(resposta.statusCode).toBe(401);
    expect(resposta.body.message).toBe("Token inválido.");
  });

  it("Não deve alterar plano de teste com token de role de analista", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const tituloAlterado = "Plano de teste alterado";
    const descricaoAlterada = "Validar o comportamento da funcionalidade de alterar plano de testes";

    const planoDeTesteAlterado = planoBuilder({
      titulo: tituloAlterado,
      descricao: descricaoAlterada
    });

    const resposta = await put(BASE_URL, PATHS.PLANOS, planoDeTesteAlterado, tokenRoleAnalista, id);
    expect(resposta.statusCode).toBe(403);
    expect(resposta.body.message).toBe("Acesso negado.");
  });

  it("Não deve alterar plano de teste com token de role de testador", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const tituloAlterado = "Plano de teste alterado";
    const descricaoAlterada = "Validar o comportamento da funcionalidade de alterar plano de testes";

    const planoDeTesteAlterado = planoBuilder({
      titulo: tituloAlterado,
      descricao: descricaoAlterada
    });

    const resposta = await put(BASE_URL, PATHS.PLANOS, planoDeTesteAlterado, tokenRoleTestador, id);
    expect(resposta.statusCode).toBe(403);
    expect(resposta.body.message).toBe("Acesso negado.");
  });

  it("Não deve alterar plano de teste com sem preenchimento de dados obrigatórios", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const planoDeTesteAlterado = planoBuilder({
      titulo: null,
      descricao: null
    });

    const resposta = await put(BASE_URL, PATHS.PLANOS, planoDeTesteAlterado, token, id);
    expect(resposta.statusCode).toBe(400);
    expect(resposta.body.message).toBe("notNull Violation: Plano.titulo cannot be null,\n" + "notNull Violation: Plano.descricao cannot be null")

  });

  it("Não deve alterar plano de teste com id inexistente", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const tituloAlterado = "Plano de teste alterado";
    const descricaoAlterada = "Validar o comportamento da funcionalidade de alterar plano de testes";

    const planoDeTesteAlterado = planoBuilder({
      titulo: tituloAlterado,
      descricao: descricaoAlterada
    });

    const resposta = await put(BASE_URL, PATHS.PLANOS, planoDeTesteAlterado, token, "f318caec-2168-4936-87ea-04b1b5d68a2c");
    expect(resposta.statusCode).toBe(404);
    expect(resposta.body.message).toBe("Plano não encontrado.");

  });

  it("Deve excluir plano de teste com sucesso", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const resposta = await del(BASE_URL, PATHS.PLANOS, token, id);
    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.message).toBe("Plano deletado com sucesso.");

  });

  it("Não deve excluir plano de teste com token inválido", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const resposta = await del(BASE_URL, PATHS.PLANOS, "12345", id);
    expect(resposta.statusCode).toBe(401);
    expect(resposta.body.message).toBe("Token inválido.");

  });

  it("Não deve excluir plano de teste com role de Analista", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const resposta = await del(BASE_URL, PATHS.PLANOS, tokenRoleAnalista, id);
    expect(resposta.statusCode).toBe(403);
    expect(resposta.body.message).toBe("Acesso negado.");

  });

  it("Não deve excluir plano de teste com role de testador", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const resposta = await del(BASE_URL, PATHS.PLANOS, tokenRoleTestador, id);
    expect(resposta.statusCode).toBe(403);
    expect(resposta.body.message).toBe("Acesso negado.");

  });

  it("Não deve excluir plano de teste com role id inválido", async () => {
    const planoDeTeste = planoBuilder();

    const respostaCriacaoPlano = await post(BASE_URL, PATHS.PLANOS, planoDeTeste, token);
    expect(respostaCriacaoPlano.statusCode).toBe(201);
    const id = respostaCriacaoPlano.body.id;

    const resposta = await del(BASE_URL, PATHS.PLANOS, token, "8bb267ab-4cd8-456e-8156-e08dad57df52");
    expect(resposta.statusCode).toBe(404);
    expect(resposta.body.message).toBe("Plano não encontrado.");

  });


});