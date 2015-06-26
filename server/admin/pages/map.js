var mongoose = require('mongoose'),
	schema = {
		'lat': String,
		'lng': String,
		'address': String
	},
	MapModel = mongoose.model('Map', schema);

var Map = function() {};

Map.getMap = function(callback) {
	MapModel.find({}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}
Map.updateMap = function(data, callback) {
	MapModel.find({}).remove().exec();

	var newMap = new MapModel({'lat': data.lat, 'lng': data.lng, 'address': data.address});

	newMap.save(function(error, data) {
		callback(error, data);
	});
}
module.exports = Map;
