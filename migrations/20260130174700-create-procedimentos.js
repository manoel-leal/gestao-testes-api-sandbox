'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
await queryInterface.createTable('Procedimentos', {
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  acao: { type: Sequelize.STRING, allowNull: false },
  resultadoEsperado: { type: Sequelize.STRING, allowNull: false },
  criadoPor: { type: Sequelize.STRING, allowNull: false },
  scriptId: { type: Sequelize.UUID, references: { model: 'Scripts', key: 'id' } },
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
