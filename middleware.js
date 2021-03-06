var express = require('express');
var app = express();
require('dotenv').config();
var models = require('./models.js');
var jwt = require('jsonwebtoken');

const verifyToken = (permissions=null) => {
  return (req, res, next) => {
    if (req.get('Authorization')) {
      const jwtToken = req.get('Authorization').split(process.env.JWT_PREFIX + ' ')[1]
      if (jwtToken) {
        jwt.verify(jwtToken, process.env.JWT_TOKEN, function(err, decoded) {
          if (decoded) {
            req.user = decoded;
            if (permissions) {
              if (permissions.includes(req.user.permission)) {
                next();
              } else {
                res.status(403);
                res.json({error: 'Insufficient permissions'});
                res.end();
              }
            } else {
              next();
            }
          }
        });
      } else {
        res.json({error: 'Invalid jwt prefix'});
      }
    } else {
      res.json({error: 'Missing Authorization header'});
    }
  }
};

// check existance of categories, genres and choices
const checkCategory = (req, res, next) => {
  models.Category.findOne({
    where: {categoryId: req.params.categoryId}
  }).then((category) =>
  {  if (category) {
      next();
    } else {
      res.status(404);
      res.json({status: 'Error', error: 'Invalid category ID'});
    }}
  )
}

const checkGenre = (req, res, next) => {
  models.Genre.findOne({
    where: {genreId: req.params.genreId}
  }).then((genre) =>
  {  if (genre) {
      next();
    } else {
      res.status(404);
      res.json({status: 'Error', error: 'Invalid genre ID'});
    }}
  )
}

const checkChoice = (req, res, next) => {
  models.Choice.findOne({
    where: {choiceId: req.params.choiceId}
  }).then((choice) =>
  {  if (choice) {
      next();
    } else {
      res.status(404);
      res.json({status: 'Error', error: 'Invalid choice ID'});
    }}
  )
}

const checkUser = (req, res, next) => {
  models.User.findOne({
    where: {userId: req.params.userId}
  }).then((user) =>
  {  if (user) {
      next();
    } else {
      res.status(404);
      res.json({status: 'Error', error: 'Invalid user ID'});
    }}
  )
}

module.exports = {
  verifyToken: verifyToken,
  checkCategory: checkCategory,
  checkGenre: checkGenre,
  checkChoice: checkChoice,
  checkUser: checkUser
}
