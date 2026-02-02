const express = require("express");
const router = express.Router();
const { Role } = require("../enums");
const autenticar = require("../middleware/auth");
const verificarPermissao = require("../middleware/permissoes");
const { Script, Procedimento } = require("../../models");

// Listar todos os scripts
router.get("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const scripts = await Script.findAll({
      include: [
        {
          model: Procedimento,
          as: 'procedimentos'
        }
      ]
    });

    res.json(scripts);
  } catch (err) {
    next(err);
  }
});

// Consultar script por ID
router.get("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const script = await Script.findByPk(req.params.id, { include: [Procedimento] });
    if (!script) return res.status(404).json({ message: "Script não encontrado." });
    res.json(script);
  } catch (err) {
    next(err);
  }
});

// Criar script (usa usuário logado)
router.post("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res, next) => {
  try {
    const { casoId, procedimentos } = req.body;
    const usuario = req.user || req.decoded; // depende do seu middleware

    const script = await Script.create({
      casoId,
      criadoPor: usuario.nome + ' ' + usuario.sobrenome
    });

    if (procedimentos && procedimentos.length > 0) {
      for (const proc of procedimentos) {
        await Procedimento.create({
          ...proc,
          criadoPor: usuario.nome + ' ' + usuario.sobrenome,
          scriptId: script.id
        });
      }
    }

    const scriptCompleto = await Script.findByPk(script.id, {
      include: [{ model: Procedimento, as: 'procedimentos' }]
    });

    res.status(201).json(scriptCompleto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar script' });
  }


});

// Atualizar script
router.put("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res, next) => {
  try {
    const script = await Script.findByPk(req.params.id);
    if (!script) return res.status(404).json({ message: "Script não encontrado." });

    await script.update(req.body);
    res.json(script);
  } catch (err) {
    next(err);
  }
});

// Deletar script
router.delete("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res, next) => {
  try {
    const script = await Script.findByPk(req.params.id);
    if (!script) return res.status(404).json({ message: "Script não encontrado." });

    await script.destroy();
    res.json({ message: "Script deletado com sucesso." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;