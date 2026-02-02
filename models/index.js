'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Importa todos os models manualmente
db.Usuario = require('./usuario')(sequelize, Sequelize.DataTypes);
db.Plano = require('./plano')(sequelize, Sequelize.DataTypes);
db.Suite = require('./suite')(sequelize, Sequelize.DataTypes);
db.Caso = require('./caso')(sequelize, Sequelize.DataTypes);
db.Registro = require('./registro')(sequelize, Sequelize.DataTypes);
db.Script = require('./script')(sequelize, Sequelize.DataTypes);
db.Procedimento = require('./procedimento')(sequelize, Sequelize.DataTypes);
db.Defeito = require('./defeito')(sequelize, Sequelize.DataTypes);

// Executa associações definidas em cada model
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;