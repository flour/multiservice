"use strict";

var auth = require("./auth");

exports.getIndex = function (req, res) {
    res.render('index', { title: 'Login/Registrieren', message: 'Registrieren oder einloggen!' });
}