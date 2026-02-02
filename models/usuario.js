'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Plano, { foreignKey: 'usuarioId' });
    }
  }
  Usuario.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    senha: { type: DataTypes.STRING, allowNull: false },
    nome: { type: DataTypes.STRING, allowNull: false },
    sobrenome: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('ADMIN','LIDER','ANALISTA','TESTADOR'), allowNull: false }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuarios'
  });
  return Usuario;
};