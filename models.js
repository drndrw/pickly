const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_ADDRESS);

const User = sequelize.define('user', {
    userId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    userName: {type: Sequelize.STRING, unique: true},
    password: {type: Sequelize.STRING},
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    permission: Sequelize.INTEGER,
    email: {type: Sequelize.STRING, unique: true}
});

const Choice = sequelize.define('choice', {
    choiceId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    choiceCreatorId: {type: Sequelize.INTEGER, references: {model: 'users', key: 'userId'}},
    choiceName: Sequelize.STRING,
    choiceAddress: Sequelize.STRING,
    choiceAddress: Sequelize.STRING,
    choiceState: Sequelize.STRING,
    choiceZip: Sequelize.STRING,
    choicePricing: Sequelize.INTEGER,
    choiceGenre: Sequelize.STRING
});

const Category = sequelize.define('category', {
  categoryId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  categoryCreatorId: {type: Sequelize.INTEGER, references: {model: 'users', key: 'userId'}},
  categoryName: Sequelize.STRING,
});

const Genre = sequelize.define('genre', {
  genreId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  genreCreatorId: {type: Sequelize.INTEGER, references: {model: 'users', key: 'userId'}},
  genreCategoryId: {type: Sequelize.INTEGER, references: {model: 'categories', key: 'categoryId'}},
  genreName: Sequelize.STRING,
});

module.exports = {
  User : User,
  Choice: Choice,
  Category: Category,
  Genre: Genre,
  dbSync : sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  })
}
