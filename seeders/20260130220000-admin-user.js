'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Usuarios', [{
      id: '00000000-0000-0000-0000-000000000001',
      username: 'admin',
      senha: 'admin',
      nome: 'admin',
      sobrenome: 'admin',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', {
      id: '00000000-0000-0000-0000-000000000001'
    });
  }
};
