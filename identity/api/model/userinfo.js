var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('UserInfo', new Schema({ 
	username: String, 
    password: String, 
    firstname: String, 
    lastname: String, 
    email: String
}));