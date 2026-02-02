const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Role } = require("../enums");
const { Usuario } = require("../../models");

// Usuário admin fixo
const adminUser = {
  username: "admin",
  senha: "admin",
  nome: "admin",
  sobrenome: "admin",
  role: Role.ADMIN
};

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { username, senha } = req.body;

    // 1. Verifica admin fixo
    if (username === adminUser.username && senha === adminUser.senha) {
      const token = jwt.sign(
        {
          id: "admin",
          username: adminUser.username,
          role: adminUser.role,
          nome: adminUser.nome,
          sobrenome: adminUser.sobrenome
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({ token });
    }

    // 2. Busca usuário no banco
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // 3. Compara senha (texto puro, já que você salvou assim)
    const senhaValida = usuario.senha === senha;

    if (!senhaValida) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // 4. Gera token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        username: usuario.username,
        role: usuario.role,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;