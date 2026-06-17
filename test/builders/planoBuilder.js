function planoBuilder({
  titulo = "Plano Teste",
  descricao = "Descrição do plano"
} = {}) {
  return {
    titulo,
    descricao
  };
}

module.exports = { planoBuilder };