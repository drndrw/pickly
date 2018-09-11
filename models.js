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
    choiceCity: Sequelize.STRING,
    choiceState: Sequelize.STRING,
    choiceZip: Sequelize.INTEGER,
    choicePricing: Sequelize.INTEGER,
    choiceGenreId: Sequelize.INTEGER
});

const Category = sequelize.define('category', {
  categoryId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  categoryCreatorId: {type: Sequelize.INTEGER, allowNull: false},
  categoryName: {type: Sequelize.STRING, unique: true},
});

const Genre = sequelize.define('genre', {
  genreId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  genreCreatorId: Sequelize.INTEGER,
  genreCategoryId: Sequelize.INTEGER,
  genreName: {type: Sequelize.STRING, unique: true},
});

User.hasMany(Category, {foreignKey: 'categoryCreatorId', sourceKey: 'userId'});
Category.belongsTo(User, {foreignKey: 'categoryCreatorId', targetKey: 'userId'});
User.hasMany(Genre, {foreignKey: 'genreCreatorId', sourceKey: 'userId'});
Genre.belongsTo(User, {foreignKey: 'genreCreatorId', targetKey: 'userId'});
Category.hasMany(Genre, {foreignKey: 'genreCategoryId', sourceKey: 'categoryId'});
Genre.belongsTo(Category, {foreignKey: 'genreCategoryId', targetKey: 'categoryId'});
User.hasMany(Choice, {foreignKey: 'choiceCreatorId', sourceKey: 'userId'});
Choice.belongsTo(User, {foreignKey: 'choiceCreatorId', targetKey: 'userId'});
Genre.hasMany(Choice, {foreignKey: 'choiceGenreId', sourceKey: 'genreId'});
Choice.belongsTo(Genre, {foreignKey: 'choiceGenreId', targetKey: 'genreId'});

module.exports = {
  User : User,
  Category: Category,
  Genre: Genre,
  Choice: Choice,
  sequelize: sequelize
}
