var mongoose = require('mongoose'),
	fs = require('fs'),
	schema = {
		'name': String,
		'image': String,
		'title': {
			'label': String,
			'readonly': Boolean
		},
		'desc': String
	},
	SlidesModel = mongoose.model('slides', schema);

var Home = function() {};

Home.getHome = function(item, callback) {
	SlidesModel.findOne({'name': item}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}
Home.updateHome = function(item, img, title, desc, callback) {
	SlidesModel.findOne({'name': item}).exec(function(error, data) {
		var image = img.replace(/^data:image\/(jpg|jpeg);base64,/,'');

		fs.writeFile('./uploads/homepage/' + item + '.jpg', image, 'base64', function(error) {
			if ( error ) {
				return console.log(err);
			}
			else {
				data.image = '../uploads/homepage/' + item + '.jpg';
				data.title.label = title;
				data.desc = desc;
				data.save();
				if ( error ) {
					callback(error);
				}
				else {
					callback(null, data);
				}
			}
		});
	});
}
module.exports = Home;
