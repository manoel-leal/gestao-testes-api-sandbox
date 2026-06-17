const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

module.exports = {
  BASE_URL,
  PATHS: {
    LOGIN: "/api/auth/login",
    USUARIOS : "/api/usuarios",
    PLANOS: "/api/planos",
    SUITES: "/api/suites",
    CASOS: "/api/casos",
    SCRIPTS: "/api/scripts",
    PROCEDIMENTOS: "/api/procedimentos",
    DEFEITOS: "/api/defeitos"
  }
};