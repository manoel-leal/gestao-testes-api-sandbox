const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

module.exports = {
  BASE_URL,
  PATHS: {
    LOGIN: "/auth/login",
    USUARIOS : "/usuarios",
    PLANOS: "/planos",
    SUITES: "/suites",
    CASOS: "/casos",
    SCRIPTS: "/scripts",
    PROCEDIMENTOS: "/procedimentos",
    DEFEITOS: "/defeitos"
  }
};