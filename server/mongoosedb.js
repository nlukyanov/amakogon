var mongoose = require('mongoose');

var Mongoose = function() {};

Mongoose.prototype.connect = function(callback) {
	mongoose.connect('mongodb://localhost/studio21');
	mongoose.connection
		.on('error', function() {})
		.once('open', function(resp) {
			callback(resp);
		});
}
module.exports = Mongoose;
