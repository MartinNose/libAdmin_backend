const fs = require('fs');
const path = require('path');
let Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = JSON.parse(fs.readFileSync("./.env"));
let db = {};

let sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

fs
  .readdirSync(__dirname)
  .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
      const model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sequelize.sync();

module.exports = db;