const express = require("express");
const router = express.Router();
const { Role } = require("../enums");
const autenticar = require("../middleware/auth");
const verificarPermissao = require("../middleware/permissoes");
const { Plano, Suite, Caso, Registro, Defeito, Script, Procedimento, Usuario } = require("../../models");

// Listar todos os planos
router.get("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const planos = await Plano.findAll({
       include: [
        { model: Usuario, as: "usuario", attributes: ["nome", "sobrenome", "username"] },
        { model: Suite, as: "suites", include: [
          { model: Caso, as: "casos", include: [
            { model: Registro, as: "registros" },
            { model: Defeito, as: "defeitos" },
            { model: Script, as: "scripts", include: [
              { model: Procedimento, as: "procedimentos" }
            ]}
          ]}
        ]}
      ]

    });
    res.json(planos);
  } catch (err) {
    next(err);
  }
});

// Consultar plano por ID
router.get("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const plano = await Plano.findByPk(req.params.id, {
       include: [
        { model: Usuario, as: "usuario", attributes: ["nome", "sobrenome", "username"] },
        { model: Suite, as: "suites", include: [
          { model: Caso, as: "casos", include: [
            { model: Registro, as: "registros" },
            { model: Defeito, as: "defeitos" },
            { model: Script, as: "scripts", include: [
              { model: Procedimento, as: "procedimentos" }
            ]}
          ]}
        ]}
      ]

    });
    if (!plano) return res.status(404).json({ message: "Plano não encontrado." });
    res.json(plano);
  } catch (err) {
    next(err);
  }
});

// Criar plano (usa dados do usuário logado)
router.post("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER]), async (req, res, next) => {
  try {
    const { titulo, descricao } = req.body;

    const plano = await Plano.create({
      titulo,
      descricao,
      criadoPor: `${req.user.nome} ${req.user.sobrenome}`, // pega do token
      usuarioId: req.user.id // pega do token
    });

    res.status(201).json(plano);
  } catch (err) {
    next(err);
  }
});

// Atualizar plano
router.put("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER]), async (req, res, next) => {
  try {
    const plano = await Plano.findByPk(req.params.id);
    if (!plano) return res.status(404).json({ message: "Plano não encontrado." });

    await plano.update(req.body);
    res.json(plano);
  } catch (err) {
    next(err);
  }
});

// Deletar plano
router.delete("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER]), async (req, res, next) => {
  try {
    const plano = await Plano.findByPk(req.params.id);
    if (!plano) return res.status(404).json({ message: "Plano não encontrado." });

    await plano.destroy();
    res.json({ message: "Plano deletado com sucesso." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;