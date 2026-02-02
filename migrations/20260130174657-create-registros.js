'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
await queryInterface.createTable('Registros', {
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  criadoPor: { type: Sequelize.STRING, allowNull: false },
  dataEHoraExecucao: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  resultado: { type: Sequelize.ENUM('NAO_EXECUTADO','SUCESSO','FALHA','BLOQUEADO','CANCELADO'), allowNull: false },
  observacao: { type: Sequelize.STRING },
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
