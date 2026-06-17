const { BASE_URL, PATHS } = require("../config/urls");
const { gerarToken } = require("../utils/auth");
const { gerarUsuarioComRole } = require("../utils/userGenerator")
const { get, getById, post, put, del } = require("../utils/apiClient");
const { validateResponseWithSchema } = require("../utils/schemaValidator");
const { userBuilder, userBuilderLider, userBuilderAnalista, userBuilderTestador } = require("../builders/userBuilder");


describe("Suite - Manter Usuários do Sistema", () => {

    let token;

    beforeAll(async () => {
        token = await gerarToken("admin", "admin");
    })

    it("Deve listar usuários com sucesso", async () =>{
        const resposta = await get(BASE_URL, PATHS.USUARIOS, token);
        expect(resposta.statusCode).toBe(200);
    })

    it("Deve criar usuário com sucesso", async () => {

        const usuario = userBuilderLider();

        const resposta = await post(BASE_URL, PATHS.USUARIOS, usuario, token);

        expect(resposta.statusCode).toBe(201);
        
    })

})