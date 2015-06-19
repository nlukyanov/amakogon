var mongoose = require('mongoose'),
	fs = require('fs'),
	schema = {
		'title': String,
		'desc': String,
		'image': String,
		'parent': String
	},
	AlbumModel = mongoose.model('albums', schema);

var Album = function() {};

Album.getAlbum = function(url, callback) {
	AlbumModel.findOne({url: url}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}
Album.addPhotos = function(title, desc, img, callback) {
	var self = this,
		url = self.transliterate(title);

	var today = new Date(),
		dd = '' + today.getDate(),
		mm = '' + today.getMonth(),
		yyyy = '' + today.getFullYear();

	if ( mm.length == 1 ) {
		mm = '0' + mm;
	}
	if ( img ) {
		var image = img.replace(/^data:image\/(jpg|jpeg);base64,/,'');

		fs.writeFile('./uploads/Album/' + title + '.jpg', image, 'base64', function(error) {
			if ( error ) {
				return console.log(error);
			}
			else {
				image = '../uploads/Album/' + title + '.jpg';

				var album = new AlbumModel({title: title, desc: desc, image: image, url: url, date: dd + '.' + mm + '.' + yyyy});

				album.save(function(error) {
					if ( error ) {
						callback(error);
					}
					else {
						callback(null, url);
					}
				});
			}
		});
	}
	else {
		var album = new AlbumModel({title: title, desc: desc, image: image, url: url, date: dd + '.' + mm + '.' + yyyy});

		album.save(function(error) {
			if ( error ) {
				callback(error);
			}
			else {
				callback(null, url);
			}
		});
	}
}
Album.removePhoto = function(url, callback) {
	//AlbumModel.findOne({url: url}).remove().exec()
}
module.exports = Album;
