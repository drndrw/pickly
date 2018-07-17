var express = require('express');
var app = express();
require('dotenv').config();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var models = require('./models.js');
var jwt = require('jsonwebtoken');

// bcrypt config
var bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS)

function verifyToken(req, res, next) {
    jwt.verify(req.get('Authorization'), 'testtoken', function(err, decoded) {
      req.user = decoded;
      next();
    });
}

app.get('/', verifyToken, (req, res) => {
  res.json({'Register': '/user'});
});

app.post('/add', jsonParser, (req, res) => {
  console.log(req.body.test)
  res.json({'route': 'add'});
});

// view users
app.get('/user', verifyToken, (req,res) => {
  models.User.findAll({
    attributes: ['userId', 'username'],
  }).then(user => res.json(user));
});

// view users
app.get('/sample', verifyToken, (req,res,next) => {
  console.log(req.user.user)
  res.json({'test': 'route'});
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
    }).then(user => res.json({'status': 'Created', 'userId': user.get().userId, 'username': user.get().userName}).end(), user => res.json({'status': 'Error', 'error': 'Username or email already exists.'}));
  });
});

// authenticate user
app.post('/user/auth', jsonParser, (req, res) => {
  models.User.findOne({
    where: {userName: req.body.userName}
  }).then(user =>
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (result) {
        var token = jwt.sign({ user: req.body.userName}, 'testtoken');
        res.json({'authToken': token});
      } else {
        res.json({'error': 'Invalid token'})
      }
    })
  );
});

// validate jwt
app.post('/user/verify', jsonParser, (req, res) => {
  console.log(req.body.authToken);
  jwt.verify(req.body.authToken, 'testtoken', function(err, decoded) {
    console.log(decoded);
    console.log(err);
  });
});

app.listen(3000, () => {
  models.Choice.sync();
  models.User.sync();
  console.log('listening');
})
