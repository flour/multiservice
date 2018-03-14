var auth = require("../helpers/auth");
var jwt = require("jsonwebtoken");
var UserAccount = require("../models/useraccount");

exports.createUser = function (args, res, next) {
  var username = args.body.username;
  var email = args.body.email;
  UserAccount.findOne({ username: username, email: email })
    .exec(function (error, result) {
      if (error || result) {
        var response = { message: "Error: Already exists" };
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(response));
      } else {
        var newUser = new UserAccount({
          username: username,
          email: email,
          amount: Math.floor(Math.random() * (10000 - 20 + 1)) + 20
        });
        newUser.save(function (error) {
          var response = { message: "Error: could not register" };
          if (error)
            res.writeHead(500, { "Content-Type": "application/json" });
          else {
            response = { message: "User created" };
            res.writeHead(200, { "Content-Type": "application/json" });
          }
          return res.end(JSON.stringify(response));
        });
      }
    });
};

exports.makeGood = function (args, res, next) {
  var decoded = jwt.decode(args.headers['authorization'].split(' ')[1], { complete: true });
  UserAccount.findOne({ username: decoded.payload.sub })
    .exec(function (error, result) {
      var response = { message: "Error: user not found" };
      if (error)
        res.writeHead(404, { "Content-Type": "application/json" });
      else {
        response = {
          message: "Got user",
          username: result.username,
          balance: result.amount
        };
        res.writeHead(200, { "Content-Type": "application/json" });
      }
      return res.end(JSON.stringify(response));
    });
}