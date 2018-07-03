var express = require('express');
var app = express();
require('dotenv').config();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var models = require('./models.js');

// bcrypt config
var bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS)

app.get('/', (req, res) => {
  res.json({'Register': '/user'});
});

app.post('/add', jsonParser, (req, res) => {
  console.log(req.body.test)
  res.json({'route': 'add'});
});

// view users
app.get('/user', (req,res) => {
  models.User.findAll({
    attributes: ['userId', 'username'],
  }).then(user => res.json(user));
});

// register user
app.post('/user', jsonParser, (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    models.User.create({
      userName: req.body.userName,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    }).then(console.log('User has been created'))
  });
  res.json({'route': 'add'});
});

// authenticate user
app.post('/user/auth', jsonParser, (req, res) => {
  bcrypt.compare(req.body.password, hash, function(err, res) {
    models.User.findOne({
      userName: req.body.userName,
      password: res
    }).then(console.log('authenticated!'))
  });
});

app.listen(3000, () => {
  models.Choice.sync();
  models.User.sync();
  console.log('listening');
})
