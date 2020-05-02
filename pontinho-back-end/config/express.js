const express = require('express');
const cors = require('cors');
const gameStateRouter = require('../route/game-state-route.js');
// const photoRouter = require('../route/photos.js');
const bodyParser = require('body-parser');
const path = require('path');

module.exports = function () {
  var app = express();
  app.set("port", 3000);
  app.use(bodyParser.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static('./public'));
  gameStateRouter(app);
  // photoRouter(app);
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname, '../public/index.html'));
  });
  return app;
};