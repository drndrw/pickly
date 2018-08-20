var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// show all choices
router.get('/', middleware.verifyToken, (req, res) => {
  models.Choice.findAll({
    attributes: ['choiceId', 'choiceName', 'choiceGenreId'],
  }).then(genres => res.json(genres));
});

// view individual choice
router.get('/:choiceId', middleware.verifyToken, middleware.checkChoice, jsonParser, (req, res) => {
  models.Choice.findOne({
    attributes: ['choiceId', 'choiceName', 'choiceAddress', 'choiceCity', 'choiceState', 'choiceZip', 'choicePricing', 'choiceGenreId'],
    where: {choiceId: req.params.choiceId}
  }).then((choice) => {
    res.json({
      choiceId: choice.choiceId,
      choiceName: choice.choiceName,
      choiceLocation: {
        choiceAddress: choice.choiceAddress,
        choiceCity: choice.choiceCity,
        choiceState: choice.choiceState,
        choiceZip: choice.choiceZip
      },
      choicePricing: choice.choicePricing,
      choiceGenreId: choice.choiceGenreId
    })
  })
});

// create a choice
router.post('/', middleware.verifyToken, jsonParser, (req, res) => {
  models.Choice.create({
    choiceCreatorId: req.user.user,
    choiceName: req.body.choiceName,
    choicePricing: req.body.choicePricing,
    choiceAddress: req.body.choiceLocation.choiceAddress,
    choiceCity: req.body.choiceLocation.choiceCity,
    choiceState: req.body.choiceLocation.choiceState,
    choiceZip: req.body.choiceLocation.choiceZip,
    choiceGenreId: req.body.choiceGenreId,
  }).then(choice => res.json({status: 'Created', choiceId: choice.get().choiceId}).end(), choice => res.json({status: 'Error', error: 'Choice already exists'}))
  .catch(choice => res.json({status: 'Error', error: 'Choice name invalid or not specified'}))
});

// edit a choice
router.put('/:choiceId', middleware.verifyToken, middleware.checkChoice, jsonParser, (req, res) => {
  testUpdates = {choiceName: req.body.choiceName}
  models.Choice.update(req.body, {
    where: {choiceId: req.params.choiceId}
  }).then(choice => res.json({status: 'Updated'}))
  .catch(error => res.json({status: 'Error', error: error}))
});

module.exports = router;
