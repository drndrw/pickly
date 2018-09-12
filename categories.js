var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var config = require('./config.js');

// delete category
router.delete('/:categoryId', middleware.verifyToken(config.permissions.admin), middleware.checkCategory, (req, res) => {
  models.Category.destroy({
    where: {categoryId: req.params.categoryId}
  }).then(response => {
    res.json({status: 'Deleted', categoryId: req.params.categoryId});
  })
});

// show all categories
router.get('/', middleware.verifyToken(), (req, res) => {
  models.Category.findAll({
    attributes: ['categoryId', 'categoryName'],
  }).then(categories => res.json(categories));
});

// create category
router.post('/', middleware.verifyToken(), jsonParser, (req, res) => {
  models.Category.create({
    categoryCreatorId: req.user.user,
    categoryName: req.body.categoryName,
  }).then(categories => res.json({status: 'Created', categoryId: categories.get().categoryId}).end(), user => res.json({status: 'Error', error: 'Category name already exists'}));
});

// view individual category
router.get('/:categoryId', middleware.verifyToken(), middleware.checkCategory, jsonParser, (req, res) => {
  models.Category.findOne({
    attributes: ['categoryId', 'categoryName'],
    include: [{
      model: models.Genre,
      attributes: ['genreId', 'genreName']
    }],
    where: {categoryId: req.params.categoryId}
  }).then((categories) => {
      res.json(categories);
  })
});

// edit a categories
router.put('/:categoryId', middleware.verifyToken(), middleware.checkCategory, jsonParser, (req, res) => {
  models.Category.update(req.body, {
    where: {categoryId: req.params.categoryId}
  }).then(category => res.json({status: 'Updated'}))
  .catch(error => res.json({status: 'Error', error: error}))
});

module.exports = router;
