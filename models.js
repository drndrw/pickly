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
    choiceCreatorId: {type: Sequelize.INTEGER, allowNull: false},
    choiceName: Sequelize.STRING,
    choiceAddress: Sequelize.STRING,
    choiceCity: Sequelize.STRING,
    choiceState: Sequelize.STRING,
    choiceZip: Sequelize.INTEGER,
    choicePricing: Sequelize.INTEGER,
    choiceGenreId: {type: Sequelize.INTEGER, allowNull: false}
});

const Category = sequelize.define('category', {
  categoryId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  categoryCreatorId: {type: Sequelize.INTEGER, allowNull: false},
  categoryName: {type: Sequelize.STRING, unique: true},
});

const Genre = sequelize.define('genre', {
  genreId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  genreCreatorId: {type: Sequelize.INTEGER, allowNull: false},
  genreCategoryId: {type: Sequelize.INTEGER, allowNull: false},
  genreName: {type: Sequelize.STRING, unique: true},
});

User.hasMany(Category, {foreignKey: 'categoryCreatorId', sourceKey: 'userId'});
Category.belongsTo(User, {foreignKey: 'categoryCreatorId', targetKey: 'userId', onDelete: 'cascade'});
User.hasMany(Genre, {foreignKey: 'genreCreatorId', sourceKey: 'userId'});
Genre.belongsTo(User, {foreignKey: 'genreCreatorId', targetKey: 'userId', onDelete: 'cascade'});
Category.hasMany(Genre, {foreignKey: 'genreCategoryId', sourceKey: 'categoryId'});
Genre.belongsTo(Category, {foreignKey: 'genreCategoryId', targetKey: 'categoryId', onDelete: 'cascade'});
User.hasMany(Choice, {foreignKey: 'choiceCreatorId', sourceKey: 'userId'});
Choice.belongsTo(User, {foreignKey: 'choiceCreatorId', targetKey: 'userId', onDelete: 'cascade'});
Genre.hasMany(Choice, {foreignKey: 'choiceGenreId', sourceKey: 'genreId'});
Choice.belongsTo(Genre, {foreignKey: 'choiceGenreId', targetKey: 'genreId', onDelete: 'cascade'});

module.exports = {
  User: User,
  Category: Category,
  Genre: Genre,
  Choice: Choice,
  sequelize: sequelize
}
