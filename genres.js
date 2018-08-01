var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// show all categories
router.get('/', middleware.verifyToken, (req, res) => {
  models.Genre.findAll({
    attributes: ['genreId', 'genreName'],
  }).then(genres => res.json(genres));
});

module.exports = router;
