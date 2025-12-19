const { Sequelize } = require('sequelize');
const config = require('../config/database.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
  }
);

const db = {};

// Import models
db.User = require('./User')(sequelize);
db.Profile = require('./Profile')(sequelize);
db.Professor = require('./Professor')(sequelize);
db.Student = require('./Student')(sequelize);
db.Course = require('./Course')(sequelize);
db.Lesson = require('./Lesson')(sequelize);
db.Availability = require('./Availability')(sequelize);
db.Booking = require('./Booking')(sequelize);
db.Payment = require('./Payment')(sequelize);
db.Conversation = require('./Conversation')(sequelize);
db.Message = require('./Message')(sequelize);
db.Review = require('./Review')(sequelize);

// Define associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

