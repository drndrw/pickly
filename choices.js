var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// create a choice
router.post('/', middleware.verifyToken, jsonParser, (req, res) => {
  models.Choice.create({
    choiceCreatorId: req.user.user,
    choiceName: req.body.choiceName,
    choicePricing: req.choice.choicePricing,
    choiceAddress: req.body.choiceLocation.choiceAddress,
    choiceCity: req.body.choiceLocation.choiceCity,
    choiceState: req.body.choiceLocation.choiceState,
    choiceZip: req.body.choiceLocation.choiceZip,
    choiceGenre: req.body.choiceLocation.choiceGenreId,
  }).then(choice => res.json({status: 'Created', choiceId: choice.get().choiceId}).end(), choice => res.json({status: 'Error', error: 'Choice already exists'}))
  .catch(choice => res.json({status: 'Error', error: 'Choice name invalid or not specified'}))
});

module.exports = router;
