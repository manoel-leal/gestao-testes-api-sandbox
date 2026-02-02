const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/planos", require("./routes/planos"));
app.use("/api/suites", require("./routes/suites"));
app.use("/api/casos", require("./routes/casos"));
app.use("/api/registros", require("./routes/registros"));
app.use("/api/scripts", require("./routes/scripts"));
app.use("/api/procedimentos", require("./routes/procedimentos"));
app.use("/api/defeitos", require("./routes/defeitos"));

// Middleware global de erros
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});