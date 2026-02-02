const express = require("express");
const router = express.Router();
const { Role } = require("../enums");
const autenticar = require("../middleware/auth");
const verificarPermissao = require("../middleware/permissoes");
const { Defeito } = require("../../models");

// Listar defeitos
router.get("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const defeitos = await Defeito.findAll();
    res.json(defeitos);
  } catch (err) { next(err); }
});

// Criar defeito
router.post("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res, next) => {
  try {
    const { titulo, descricao, criticidade, situacao, evidencia, casoId } = req.body;
    if (!casoId) return res.status(400).json({ message: "casoId é obrigatório." });

    const defeito = await Defeito.create({
      titulo,
      descricao,
      criticidade,
      situacao,
      evidencia,
      casoId,
      criadoPor: `${req.user.nome} ${req.user.sobrenome}`,
      comentarios: [] // inicia vazio
    });

    res.status(201).json(defeito);
  } catch (err) { next(err); }
});

// Adicionar comentário
router.post("/:id/comentarios", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const { comentario } = req.body;
    if (!comentario) return res.status(400).json({ message: "comentario é obrigatório." });

    const defeito = await Defeito.findByPk(req.params.id);
    if (!defeito) return res.status(404).json({ message: "Defeito não encontrado." });

    const comentariosAtualizados = [...(defeito.comentarios || []), comentario];
    await defeito.update({ comentarios: comentariosAtualizados });

    res.json(defeito);
  } catch (err) { next(err); }
});

module.exports = router;