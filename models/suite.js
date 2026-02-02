'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class Suite extends Model {
  static associate(models) {
    Suite.belongsTo(models.Plano, { foreignKey: 'planoId', as: 'plano' });
    Suite.hasMany(models.Caso, { foreignKey: 'suiteId', as: 'casos' });
  }
}
  Suite.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    titulo: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: false },
    funcionalidade: { type: DataTypes.STRING, allowNull: false },
    criadoPor: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'Suite',
  });
  return Suite;
};