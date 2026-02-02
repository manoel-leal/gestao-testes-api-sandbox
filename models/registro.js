'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Registro extends Model {
    static associate(models) {
      Registro.belongsTo(models.Caso, { foreignKey: 'casoId' });
    }
  }
  Registro.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    criadoPor: { type: DataTypes.STRING, allowNull: false },
    dataEHoraExecucao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    resultado: { type: DataTypes.ENUM('NAO_EXECUTADO','SUCESSO','FALHA','BLOQUEADO','CANCELADO'), allowNull: false },
    observacao: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Registro',
  });
  return Registro;
};