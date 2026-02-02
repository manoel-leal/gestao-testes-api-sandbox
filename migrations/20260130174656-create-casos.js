'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
await queryInterface.createTable('Casos', {
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  titulo: { type: Sequelize.STRING, allowNull: false },
  prioridade: { type: Sequelize.ENUM('BAIXA','MEDIA','ALTA'), defaultValue: 'MEDIA' },
  descricao: { type: Sequelize.STRING, allowNull: false },
  preCondicao: { type: Sequelize.STRING },
  resultado: { type: Sequelize.ENUM('NAO_EXECUTADO','SUCESSO','FALHA','BLOQUEADO','CANCELADO'), defaultValue: 'NAO_EXECUTADO' },
  criadoPor: { type: Sequelize.STRING, allowNull: false },
  suiteId: { type: Sequelize.UUID, references: { model: 'Suites', key: 'id' } },
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
