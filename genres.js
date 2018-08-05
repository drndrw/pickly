var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// show all genres
router.get('/', middleware.verifyToken, (req, res) => {
  models.Genre.findAll({
    attributes: ['genreId', 'genreName', 'genreCategoryId'],
  }).then(genres => res.json(genres));
});

// create a genre
router.post('/', middleware.verifyToken, jsonParser, (req, res) => {
  models.Category.findOne({
    where: {categoryName: req.body.parentCategory}
  })
    .then(parentCategory =>
      models.Genre.create({
        genreCreatorId: req.user.user,
        genreName: req.body.genreName,
        genreCategoryId: parentCategory.categoryId
      }).then(genres => res.json({status: 'Created', genreId: genres.get().genreId}).end(), user => res.json({status: 'Error', error: 'Genre name already exists'})))
    .catch(parentCategory => res.json({status: 'Error', error: 'Category name invalid or not specified'}))
});

module.exports = router;
