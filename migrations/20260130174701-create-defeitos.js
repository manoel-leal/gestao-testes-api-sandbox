'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
await queryInterface.createTable('Defeitos', {
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  titulo: { type: Sequelize.STRING, allowNull: false },
  descricao: { type: Sequelize.STRING, allowNull: false },
  criticidade: { type: Sequelize.ENUM('BAIXA','MEDIA','ALTA'), defaultValue: 'MEDIA' },
  situacao: { type: Sequelize.ENUM('ABERTO','EM_CORRECAO','CORRIGIDO','EM_TESTES','CONCLUIDO','CANCELADO'), defaultValue: 'ABERTO' },
  evidencia: { type: Sequelize.TEXT }, // base64 string
  criadoPor: { type: Sequelize.STRING, allowNull: false },
  casoId: { type: Sequelize.UUID, references: { model: 'Casos', key: 'id' } },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
