const express = require("express");
const router = express.Router();
const { Role } = require("../enums");
const autenticar = require("../middleware/auth");
const verificarPermissao = require("../middleware/permissoes");
const { Registro } = require("../../models");

router.get("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const registros = await Registro.findAll();
    res.json(registros);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const registro = await Registro.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: "Registro não encontrado." });
    res.json(registro);
  } catch (err) {
    next(err);
  }
});

// Criar registro (usa usuário logado)
router.post("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const { resultado, observacao, casoId } = req.body;
    if (!casoId) return res.status(400).json({ message: "casoId é obrigatório." });

    const registro = await Registro.create({
      resultado,
      observacao,
      casoId,
      criadoPor: `${req.user.nome} ${req.user.sobrenome}`
    });

    res.status(201).json(registro);
  } catch (err) { next(err); }

});

router.put("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const registro = await Registro.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: "Registro não encontrado." });

    await registro.update(req.body);
    res.json(registro);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const registro = await Registro.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: "Registro não encontrado." });

    await registro.destroy();
    res.json({ message: "Registro deletado com sucesso." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;