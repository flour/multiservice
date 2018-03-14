'use strict';

var swaggerTools = require("swagger-tools");
var express = require('express');
var app = express();
var YAML = require("yamljs");
var mongoose = require('mongoose');

var auth = require("./api/helpers/auth");
var swaggerConfig = YAML.load("./api/swagger/swagger.yaml");
var config = require('./config');
var port = process.env.PORT || config.defaultPort;

module.exports = app; // for testing
mongoose.connect(config.database).then(
  () => { console.log('Connected to mongo DB'); },
  (error) => { console.log(error); }
);

swaggerTools.initializeMiddleware(swaggerConfig, function (middleware) {
  var routerConfig = {
    controllers: "./api/controllers",
    useStubs: false
  };

  app.use(middleware.swaggerMetadata());
  app.use(
    middleware.swaggerSecurity({
      Bearer: auth.verifyToken
    })
  );

  app.use(middleware.swaggerRouter(routerConfig));
  app.use(middleware.swaggerUi());
  app.listen(port, function () {
    console.log("Started server on port " + port);
  });
});