'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
 class Caso extends Model {
  static associate(models) {
    Caso.belongsTo(models.Suite, { foreignKey: 'suiteId', as: 'suite' });
    Caso.hasMany(models.Registro, { foreignKey: 'casoId', as: 'registros' });
    Caso.hasMany(models.Defeito, { foreignKey: 'casoId', as: 'defeitos' });
    Caso.hasMany(models.Script, { foreignKey: 'casoId', as: 'scripts' });
  }
}
  Caso.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    prioridade: { type: DataTypes.ENUM('BAIXA','MEDIA','ALTA'), defaultValue: 'MEDIA' },
    descricao: { type: DataTypes.STRING, allowNull: false },
    preCondicao: { type: DataTypes.STRING },
    resultado: { type: DataTypes.ENUM('NAO_EXECUTADO','SUCESSO','FALHA','BLOQUEADO','CANCELADO'), defaultValue: 'NAO_EXECUTADO' },
    criadoPor: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'Caso',
  });
  return Caso;
};