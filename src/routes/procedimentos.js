const express = require("express");
const router = express.Router();
const { Role } = require("../enums");
const autenticar = require("../middleware/auth");
const verificarPermissao = require("../middleware/permissoes");
const { Procedimento } = require("../../models");

router.get("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res) => {
  const procedimentos = await Procedimento.findAll();
  res.json(procedimentos);
});

router.get("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res) => {
  try {
    const { descricao, scriptId } = req.body;
    if (!scriptId) return res.status(400).json({ message: "scriptId é obrigatório." });

    const procedimento = await Procedimento.create({
      descricao,
      scriptId,
      criadoPor: `${req.user.nome} ${req.user.sobrenome}`
    });

    res.status(201).json(procedimento);
  } catch (err) { next(err); }

});

router.post("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res) => {
  try {
    const { acao, resultadoEsperado, scriptId } = req.body;
    const usuario = req.user; // vem do token

    if (!acao || !resultadoEsperado || !scriptId) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    const procedimento = await Procedimento.create({
      acao,
      resultadoEsperado,
      criadoPor: usuario.nome + ' ' + usuario.sobrenome,
      scriptId
    });

    res.status(201).json(procedimento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar procedimento' });
  }


});

router.put("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res) => {
  const procedimento = await Procedimento.findByPk(req.params.id);
  if (!procedimento) return res.status(404).json({ message: "Procedimento não encontrado." });
  await procedimento.update(req.body);
  res.json(procedimento);
});

router.delete("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res) => {
  const procedimento = await Procedimento.findByPk(req.params.id);
  if (!procedimento) return res.status(404).json({ message: "Procedimento não encontrado." });
  await procedimento.destroy();
  res.json({ message: "Procedimento deletado com sucesso." });
});

module.exports = router;