var express = require('express');
var app = express();
require('dotenv').config()

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_ADDRESS);

app.get('/', (req, res) => {
  res.json({'route': 'index'});
});

app.listen(3000, () => {
  sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
  console.log('listening');
})
