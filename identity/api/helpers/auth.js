"use strict";

var jwt = require("jsonwebtoken");
var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('../../config');

exports.createToken = function (email, username) {
    var token = jwt.sign(
        {
            sub: username,
            iss: config.issuer
        },
        config.secret
    );
    return token;
};

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

exports.verifyTokenInner = function (req, callback) {
    var result = false;
    var gotAuth = false;
    var token = '';
    for (var headerName in req.headers) {
        if (headerName == 'Authorization') {
            gotAuth = true;
            token = req.headers[headerName];
        }
    }
    if (!gotAuth || token.indexOf("Bearer ") != 0)
        return false;
    jwt.verify(token.split(" ")[1], config.secret, function (error, decodedToken) {
        if (error != null || !decodedToken)
            result = false;
        var issuerMatch = decodedToken.iss == config.issuer;
        if (issuerMatch) {
            req.auth = decodedToken;
            result = true;
        } else {
            result = false;
        }
    });
    return result;
}

exports.makeHash = function (data) {
    return crypto.createHash("sha256")
        .update(data, 'utf-8')
        .digest("base64");
}