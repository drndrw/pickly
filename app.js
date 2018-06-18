var express = require('express');
var app = express();
require('dotenv').config();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
// database connection
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_ADDRESS);

const Choice =
  sequelize.define('choice', {
    choiceId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    choiceName: Sequelize.STRING,
    choiceAddress: Sequelize.STRING,
    choiceGenre: Sequelize.STRING
  })

app.get('/', (req, res) => {
  res.json({'route': 'index'});
});

app.post('/add', jsonParser, (req, res) => {
  console.log(req.body.test)
  res.json({'route': 'add'});
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
  Choice.sync();
  console.log('listening');
})
