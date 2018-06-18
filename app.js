var express = require('express');
var app = express();

app.get('/', (req, res) => {
  res.json({'route': 'index'});
});

app.listen(3000, () => {
  console.log('listening');
})
