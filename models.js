const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_ADDRESS);

module.exports = {
  Choice : sequelize.define('choice', {
      choiceId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
      choiceName: Sequelize.STRING,
      choiceAddress: Sequelize.STRING,
      choiceGenre: Sequelize.STRING
  }),
  dbSync : sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
}
