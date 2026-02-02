'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Defeito extends Model {
    static associate(models) {
      Defeito.belongsTo(models.Caso, { foreignKey: 'casoId' });
    }
  }
  Defeito.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: false },
    criticidade: { type: DataTypes.ENUM('BAIXA','MEDIA','ALTA'), defaultValue: 'MEDIA' },
    situacao: { type: DataTypes.ENUM('ABERTO','EM_CORRECAO','CORRIGIDO','EM_TESTES','CONCLUIDO','CANCELADO'), defaultValue: 'ABERTO' },
    evidencia: { type: DataTypes.TEXT },
    criadoPor: { type: DataTypes.STRING, allowNull: false },
    comentarios: { type: DataTypes.ARRAY(DataTypes.STRING) }
  }, {
    sequelize,
    modelName: 'Defeito',
  });
  return Defeito;
};