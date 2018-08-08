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

module.exports = router;
