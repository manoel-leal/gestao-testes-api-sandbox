'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.createTable('Usuarios', {
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  username: { type: Sequelize.STRING, allowNull: false },
  senha: { type: Sequelize.STRING, allowNull: false },
  nome: { type: Sequelize.STRING, allowNull: false },
  sobrenome: { type: Sequelize.STRING, allowNull: false },
  role: { type: Sequelize.ENUM('ADMIN','LIDER','ANALISTA','TESTADOR'), allowNull: false },
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
