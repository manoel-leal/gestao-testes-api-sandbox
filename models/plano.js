'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class Plano extends Model {
  static associate(models) {
    Plano.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    Plano.hasMany(models.Suite, { foreignKey: 'planoId', as: 'suites' });
  }
}

  Plano.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: false },
    criadoPor: { type: DataTypes.STRING, allowNull: false },
    usuarioId: { type: DataTypes.UUID, allowNull: false }
  }, {
    sequelize,
    modelName: 'Plano',
    tableName: 'Planos'
  });
  return Plano;
};