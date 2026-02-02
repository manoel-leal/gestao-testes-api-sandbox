const express = require("express");
const router = express.Router();
const { Role } = require("../enums");
const autenticar = require("../middleware/auth");
const verificarPermissao = require("../middleware/permissoes");
const { Caso, Defeito, Registro, Script, Procedimento } = require("../../models");

router.get("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const casos = await Caso.findAll({
      include: [
        {
          model: Script,
          as: 'scripts',
          include: [
            {
              model: Procedimento,
              as: 'procedimentos'
            }
          ]
        },
        {
          model: Defeito,
          as: 'defeitos'
        },
        {
          model: Registro,
          as: 'registros'
        }
      ]
    });

    res.json(casos);
  } catch (err) {
    next(err);
  }
});


router.get("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const caso = await Caso.findByPk(req.params.id, { include: [Defeito, Registro] });
    if (!caso) return res.status(404).json({ message: "Caso não encontrado." });
    res.json(caso);
  } catch (err) {
    next(err);
  }
});

// Criar caso (usa usuário logado)
router.post("/", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res, next) => {
try {
    const { titulo, prioridade, descricao, preCondicao, suiteId } = req.body;
    if (!suiteId) return res.status(400).json({ message: "suiteId é obrigatório." });

    const caso = await Caso.create({
      titulo,
      prioridade,
      descricao,
      preCondicao,
      suiteId,
      criadoPor: `${req.user.nome} ${req.user.sobrenome}`
    });

    res.status(201).json(caso);
  } catch (err) { next(err); }

});

router.put("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res, next) => {
  try {
    const caso = await Caso.findByPk(req.params.id);
    if (!caso) return res.status(404).json({ message: "Caso não encontrado." });

    await caso.update(req.body);
    res.json(caso);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA]), async (req, res, next) => {
  try {
    const caso = await Caso.findByPk(req.params.id);
    if (!caso) return res.status(404).json({ message: "Caso não encontrado." });

    await caso.destroy();
    res.json({ message: "Caso deletado com sucesso." });
  } catch (err) {
    next(err);
  }
});

router.post("/execucao", autenticar, verificarPermissao([Role.ADMIN, Role.LIDER, Role.ANALISTA, Role.TESTADOR]), async (req, res, next) => {
  try {
    const { idCaso, resultado, observacao } = req.body;

    if (!idCaso || !resultado) {
      return res.status(400).json({ message: "idCaso e resultado são obrigatórios." });
    }

    const caso = await Caso.findByPk(idCaso, {
      include: [
        { model: Script, as: 'scripts', include: [{ model: Procedimento, as: 'procedimentos' }] },
        { model: Defeito, as: 'defeitos' },
        { model: Registro, as: 'registros' }
      ]
    });

    if (!caso) {
      return res.status(404).json({ message: "Caso não encontrado." });
    }

    // Atualiza resultado do caso
    await caso.update({ resultado });

    // Cria um registro de execução
    const registro = await Registro.create({
      casoId: idCaso,
      resultado,
      observacao,
      criadoPor: `${req.user.nome} ${req.user.sobrenome}`
    });

    res.status(201).json({ caso, registro });
  } catch (err) {
    next(err);
  }
});

module.exports = router;