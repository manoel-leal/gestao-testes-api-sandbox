'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Script extends Model {
    static associate(models) {
            Script.belongsTo(models.Caso, {
                  foreignKey: 'casoId',
                  as: 'caso'
            });

      // Script tem muitos Procedimentos
      Script.hasMany(models.Procedimento, {
        foreignKey: 'scriptId',
        as: 'procedimentos',
        onDelete: 'CASCADE',
        hooks: true
      });


    }
  }

  Script.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    criadoPor: { type: DataTypes.STRING, allowNull: false },
    casoId: { type: DataTypes.UUID, allowNull: false }
  }, {
    sequelize,
    modelName: 'Script',
    tableName: 'Scripts'
  });

  return Script;
};