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
    choiceCreatorId: Sequelize.INTEGER,
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
  categoryCreatorId: Sequelize.INTEGER,
  categoryName: Sequelize.STRING,
});

const Genre = sequelize.define('genre', {
  genreId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  genreCreatorId: Sequelize.INTEGER,
  genreCategoryId: Sequelize.INTEGER,
  genreName: Sequelize.STRING,
});

Choice.belongsTo(User, {foreignKey: 'choiceCreatorId'});
Category.belongsTo(User, {foreignKey: 'categoryCreatorId'});
Genre.belongsTo(User, {foreignKey: 'genreCreatorId'});
Genre.belongsTo(Category, {foreignKey: 'genreCategoryId'});

module.exports = {
  User : User,
  Choice: Choice,
  dbSync : sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  })
}
