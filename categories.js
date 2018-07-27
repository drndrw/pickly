var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js')

// show all categories
router.get('/', middleware.verifyToken, (req, res) => {
  models.User.findAll({
    attributes: ['categoryId', 'categoryName'],
  }).then(categories => res.json(categories));
});
