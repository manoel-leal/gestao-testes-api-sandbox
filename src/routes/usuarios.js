const express = require("express");
const router = express.Router();
const { Role } = require("../enums");
const autenticar = require("../middleware/auth");
const verificarPermissao = require("../middleware/permissoes");
const { Usuario } = require("../../models");

router.get("/", autenticar, verificarPermissao([Role.ADMIN]), async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

router.get("/:id", autenticar, verificarPermissao([Role.ADMIN]), async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });
  res.json(usuario);
});

router.post("/", autenticar, verificarPermissao([Role.ADMIN]), async (req, res) => {
  const usuario = await Usuario.create(req.body);
  res.status(201).json(usuario);
});

router.put("/:id", autenticar, verificarPermissao([Role.ADMIN]), async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });
  await usuario.update(req.body);
  res.json(usuario);
});

router.delete("/:id", autenticar, verificarPermissao([Role.ADMIN]), async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });
  await usuario.destroy();
  res.json({ message: "Usuário deletado com sucesso." });
});

module.exports = router;