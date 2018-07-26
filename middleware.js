var express = require('express');
var app = express();
require('dotenv').config();
var jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
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
};

module.exports = {
  verifyToken: verifyToken
}
