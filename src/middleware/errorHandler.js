function errorHandler(err, req, res, next) {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Erro interno no servidor";

  if (err.name === "SequelizeValidationError" || err.name === "SequelizeDatabaseError") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}

module.exports = errorHandler;   // ✅ exporta a função corretamente