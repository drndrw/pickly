var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

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

module.exports = router;
