var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');

// show all categories
router.get('/', middleware.verifyToken, (req, res) => {
  models.Category.findAll({
    attributes: ['categoryId', 'categoryName'],
  }).then(categories => res.json(categories));
});

module.exports = router;
