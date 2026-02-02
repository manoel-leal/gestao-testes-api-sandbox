'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Procedimento extends Model {
    static associate(models) {
      // Procedimento pertence a um Script
      Procedimento.belongsTo(models.Script, {
        foreignKey: 'scriptId',
        as: 'script',
        onDelete: 'CASCADE'
      });
    }
  }

  Procedimento.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    acao: { type: DataTypes.STRING, allowNull: false },
    resultadoEsperado: { type: DataTypes.STRING, allowNull: false },
    criadoPor: { type: DataTypes.STRING, allowNull: false },
    scriptId: { type: DataTypes.UUID, allowNull: false }
  }, {
    sequelize,
    modelName: 'Procedimento',
    tableName: 'Procedimentos'
  });

  return Procedimento;
};