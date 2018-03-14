var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('UserAccount', new Schema({ 
	username: String, 
    email: String,
    amount: Number
}));