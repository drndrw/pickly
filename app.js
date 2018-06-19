var express = require('express');
var app = express();
require('dotenv').config();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var models = require('./models.js');

app.get('/', (req, res) => {
  models.testF('testing ya');
  res.json({'route': 'index'});
});

app.post('/add', jsonParser, (req, res) => {
  console.log(req.body.test)
  res.json({'route': 'add'});
});

app.listen(3000, () => {
  models.Choice.sync();
  models.User.sync();
  console.log('listening');
})
