var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('./models.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');
require('dotenv').config();

// bcrypt config
var bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS)

// view users
router.get('/', middleware.verifyToken, (req,res) => {
  models.User.findAll({
    attributes: ['userId', 'username'],
  }).then(user => res.json(user));
});

// register user
router.post('/', jsonParser, (req, res) => {
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
router.post('/auth', jsonParser, (req, res) => {
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

module.exports = router;
