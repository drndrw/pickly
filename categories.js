var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

models.Genre.belongsTo(models.Category, {foreignKey: 'genreCategoryId', sourceKey: 'categoryId'});
models.Category.hasMany(models.Genre, {targetKey: 'categoryId', foreignKey: 'genreCategoryId'});

// show all categories
router.get('/', middleware.verifyToken, (req, res) => {
  models.Category.findAll({
    attributes: ['categoryId', 'categoryName'],
  }).then(categories => res.json(categories));
});

// create category
router.post('/', middleware.verifyToken, jsonParser, (req, res) => {
  models.Category.create({
    categoryCreatorId: req.user.user,
    categoryName: req.body.categoryName,
  }).then(categories => res.json({status: 'Created', categoryId: categories.get().categoryId}).end(), user => res.json({status: 'Error', error: 'Category name already exists'}));
});

// view individual category
router.get('/:categoryId', middleware.verifyToken, jsonParser, (req, res) => {
  models.Category.findAll({
    attributes: ['categoryId', 'categoryName'],
    include: [{
      model: models.Genre,
      attributes: ['genreId', 'genreName']
    }],
    where: {categoryId: req.params.categoryId}
  }).then((categories) => {
    console.log(categories.length)
    if (categories.length === 0) {
      res.status(404);
      res.json({status: 'Error', error: 'Invalid category ID'});
    } else {
      res.json(categories);
    }
  })
});

module.exports = router;
