"use strict";

var jwt = require("jsonwebtoken");
var mongoose = require('mongoose');
var config = require("../../config");

exports.verifyToken = function (req, authOrSecDef, token, callback) {
    function sendError() {
        return req.res.status(403).json({ message: "Error: Access Denied" });
    }

    if (!token || token.indexOf("Bearer ") != 0)
        return callback(sendError());

    var tokenString = token.split(" ")[1];
    jwt.verify(tokenString, config.secret, function (error, decodedToken) {
        if (error != null || !decodedToken)
            return callback(sendError());
        var issuerMatch = decodedToken.iss == config.issuer;
        if (issuerMatch) {
            req.auth = decodedToken;
            return callback(null);
        } else {
            return callback(sendError());
        }
    });
}