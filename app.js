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
    const jwtToken = req.get('Authorization').split(process.env.JWT_PREFIX + ' ')[1]
    if (jwtToken) {
      jwt.verify(jwtToken, process.env.JWT_TOKEN, function(err, decoded) {
        if (decoded) {
          req.user = decoded;
          next();
        } else {
          res.json({error: err.message});
        }
      });
    } else {
      res.json({error: 'Invalid jwt prefix'})
    }
}

app.get('/', verifyToken, (req, res) => {
  // console.log(process.hrtime());
  // console.log(new Date().getTime());
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
      email: req.body.email,
      permission: 0
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
        const currentTime = new Date().getTime();
        var token = jwt.sign({user: user.userId, permission: user.permission}, process.env.JWT_TOKEN, {expiresIn: process.env.JWT_EXPIRES});
        res.json({'authToken': token});
      } else {
        res.json({error: 'Invalid token'});
      }
    })
  ).catch(user => res.json({error: 'Invalid username'}));
});

app.listen(3000, () => {
  models.User.sync();
  models.Choice.sync();
  console.log('listening');
})
