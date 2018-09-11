var express = require('express');
var app = express();
require('dotenv').config();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var models = require('./models.js');
var jwt = require('jsonwebtoken');
var middleware = require('./middleware.js')
var category = require('./categories.js')
var genre = require('./genres.js')
var choice = require('./choices.js')
var user = require('./users.js')

app.get('/', middleware.verifyToken(), (req, res) => {
  res.json({'Register': '/user'});
});

app.post('/add', jsonParser, (req, res) => {
  console.log(req.body.test)
  res.json({'route': 'add'});
});

// import routes
app.use('/category', category)
app.use('/genre', genre)
app.use('/choice', choice)
app.use('/user', user)

app.listen(3000, () => {
  models.sequelize.sync()
})
