const express = require("express");
const router = express.Router();
const { Role } = require("../enums");
const autenticar = require("../middleware/auth");
const verificarPermissao = require("../middleware/permissoes");
const { Suite, Caso } = require("../../models");

router.get("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const suites = await Suite.findAll({
      include: [{ model: Caso, as: "casos" }]
    });
    res.json(suites);
  } catch (err) { next(err); }

});

router.get("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const suite = await Suite.findByPk(req.params.id, { include: [Caso] });
    if (!suite) return res.status(404).json({ message: "Suite não encontrada." });
    res.json(suite);
  } catch (err) {
    next(err);
  }
});

// Criar suite (usa usuário logado)
router.post("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res, next) => {
  try {
    const { titulo, descricao, funcionalidade, planoId } = req.body;
    if (!planoId) return res.status(400).json({ message: "planoId é obrigatório." });

    const suite = await Suite.create({
      titulo,
      descricao,
      funcionalidade,
      planoId,
      criadoPor: `${req.user.nome} ${req.user.sobrenome}`
    });

    res.status(201).json(suite);
  } catch (err) { next(err); }

});

router.put("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res, next) => {
  try {
    const suite = await Suite.findByPk(req.params.id);
    if (!suite) return res.status(404).json({ message: "Suite não encontrada." });

    await suite.update(req.body);
    res.json(suite);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res, next) => {
  try {
    const suite = await Suite.findByPk(req.params.id);
    if (!suite) return res.status(404).json({ message: "Suite não encontrada." });

    await suite.destroy();
    res.json({ message: "Suite deletada com sucesso." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;