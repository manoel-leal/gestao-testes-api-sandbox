'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Defeitos', 'comentarios', {
      type: Sequelize.ARRAY(Sequelize.STRING), // array de strings
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Defeitos', 'comentarios');
  }
};