var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var config = require('./config.js');

// delete genre
router.delete('/:genreId', middleware.verifyToken(config.permissions.admin), middleware.checkGenre, (req, res) => {
  models.Genre.destroy({
    where: {genreId: req.params.genreId}
  }).then(response => {
    res.json({status: 'Deleted', genreId: parseInt(req.params.genreId)});
  })
});

// show all genres
router.get('/', middleware.verifyToken(), (req, res) => {
  models.Genre.findAll({
    attributes: ['genreId', 'genreName', 'genreCategoryId'],
  }).then(genres => res.json(genres));
});

// create a genre
router.post('/', middleware.verifyToken(), jsonParser, (req, res) => {
  models.Category.findOne({
    where: {categoryId: req.body.parentCategoryId}
  })
    .then(parentCategory =>
      models.Genre.create({
        genreCreatorId: req.user.user,
        genreName: req.body.genreName,
        genreCategoryId: parentCategory.categoryId
      }).then(genres => res.json({status: 'Created', genreId: genres.get().genreId}).end(), user => res.json({status: 'Error', error: 'Genre name already exists'})))
    .catch(parentCategory => res.json({status: 'Error', error: 'Category name invalid or not specified'}))
});

// edit a genre
router.put('/:genreId', middleware.verifyToken(), middleware.checkGenre, jsonParser, (req, res) => {
  models.Genre.update(req.body, {
    where: {genreId: req.params.genreId}
  }).then(genre => res.json({status: 'Updated'}))
  .catch(error => res.json({status: 'Error', error: error}))
});

// view individual genre
router.get('/:genreId', middleware.verifyToken(), middleware.checkGenre, jsonParser, (req, res) => {
  models.Genre.findOne({
    attributes: ['genreId', 'genreName', 'genreCategoryId'],
    include: [{
      model: models.Choice,
      attributes: ['choiceId', 'choiceName']
    }],
    where: {genreId: req.params.genreId}
  }).then((genre) => {
      res.json(genre);
  })
});

module.exports = router;
