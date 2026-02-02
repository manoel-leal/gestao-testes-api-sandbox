'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Planos', 'usuarioId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Usuarios', // tabela de usuários
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Planos', 'usuarioId');
  }
};
