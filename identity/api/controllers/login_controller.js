var http = require('http');
var config = require("../../config");
var auth = require("../helpers/auth");
var UserInfo = require("../model/userinfo");

exports.loginPost = function (args, res, next) {
    var username = args.body.data.username;
    var password = auth.makeHash(args.body.data.password);
    UserInfo.findOne({ username: username, password: password })
        .exec(function (error, result) {
            if (error || !result) {
                var response = { message: "Error: Credentials incorrect" };
                res.writeHead(403, { "Content-Type": "application/json" });
                return res.end(JSON.stringify(response));
            } else if (result) {
                var tokenString = auth.createToken(result.email, result.username);
                var response = { token: tokenString };
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify(response));
            }
        });
};

exports.registerPost = function (args, res, next) {
    var userInfo = args.body.data;
    UserInfo.findOne({ username: userInfo.username }).exec(function (error, result) {
        if (result || error) {
            console.log('User already exists: ' + userInfo.username);
            var response = { message: "Error: already exists" };
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(response));
        }
        var newUser = new UserInfo({
            username: userInfo.username,
            password: auth.makeHash(userInfo.password),
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            email: userInfo.email
        });
        newUser.save(function (error) {
            var response = { message: "Error: could not register" };
            if (error)
                res.writeHead(500, { "Content-Type": "application/json" });
            else {
                response = { message: "Registered" };
                res.writeHead(200, { "Content-Type": "application/json" });
                createAccount(userInfo.username, userInfo.email);
            }
            return res.end(JSON.stringify(response));
        })
    });
}

function createAccount(username, email) {
    var data = JSON.stringify({
        'username': username,
        'email': email
    });

    var options = {
        host: config.accounting,
        port: config.accountingPort,
        path: '/api/usercreate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    var postRequest = http.request(options, function (res) {
        res.setEncoding('utf8');        
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
        res.on('error', function (error) {
            console.log(error);
        });
    });

    postRequest.write(data);
}