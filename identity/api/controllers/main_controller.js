var http = require('http');
var config = require("../../config");

exports.unprotectedGet = function (args, res, next) {
    var response = { message: "My resource!" };
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(response));
};

exports.protectedGet = function (args, res, next) {
    var response = { message: "My protected resource for authenticated users!" };
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(response));
};

exports.makeGood = function (args, res, next) {
    var options = {
        host: config.accounting,
        port: config.accountingPort,
        path: '/api/makeGood',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': args.headers['authorization']
        }
    };

    var getRequest = http.get(options, function (accRes) {
        accRes.setEncoding('utf8');
        accRes.on('data', function (chunk) {
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(chunk);
        });
        accRes.on('error', function (error) {
            var response = { message: "Could not get data", error: error };
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(response));
        });
    });
}