var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

models.Choice.belongsTo(models.Genre, {foreignKey: 'choiceGenreId', sourceKey: 'choiceId'});
models.Genre.hasMany(models.Choice, {targetKey: 'choiceId', foreignKey: 'choiceGenreId'});

// show all genres
router.get('/', middleware.verifyToken, (req, res) => {
  models.Genre.findAll({
    attributes: ['genreId', 'genreName', 'genreCategoryId'],
  }).then(genres => res.json(genres));
});

// create a genre
router.post('/', middleware.verifyToken, jsonParser, (req, res) => {
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

// view individual genre
router.get('/:genreId', middleware.verifyToken, jsonParser, (req, res) => {
  models.Genre.findAll({
    attributes: ['genreId', 'genreName', 'genreCategoryId'],
    include: [{
      model: models.Choice,
      attributes: ['choiceId', 'choiceName']
    }],
    where: {genreId: req.params.genreId}
  }).then((genre) => {
    console.log(genre.length)
    if (genre.length === 0) {
      res.status(404);
      res.json({status: 'Error', error: 'Invalid genre ID'});
    } else {
      res.json(genre);
    }
  })
});

module.exports = router;