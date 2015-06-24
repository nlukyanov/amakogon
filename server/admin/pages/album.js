var mongoose = require('mongoose'),
	fs = require('fs'),
	schema = {
		'title': String,
		'desc': String,
		'image': String,
		'parent': String,
		'tags': [],
		'id': Number,
		'parentUrl': String
	},
	AlbumModel = mongoose.model('albums', schema);

var Album = function() {};

Album.getPhotos = function(parent, callback) {
	AlbumModel.find({'parent': parent}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}
Album.getPhotosByTag = function(tag, callback) {
	AlbumModel.find({'tags': tag}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}
Album.updatePhotos = function(parent, folder, photos, callback) {
	var self = this;

	folder = folder.split('').reverse().join('');
	folder = folder.substr(0, folder.indexOf('/'));
	folder = folder.substr(folder.indexOf('.') + 1, folder.length);
	folder = folder.split('').reverse().join('');
	folder = './uploads/albums/' + folder + '/';

	var index = 0;

	createImage(photos.length);

	function createImage(length) {
		if ( index < length ) {
			if ( photos[index].image.indexOf('data:image') == 0 ) {
				var image = photos[index].image.replace(/^data:image\/(jpg|jpeg);base64,/,'');
				var today = new Date(),
					dd = '' + today.getDate(),
					mm = '' + today.getMonth(),
					yyyy = '' + today.getFullYear(),
					h = '' + today.getHours(),
					m = '' + today.getMinutes(),
					s = '' + today.getSeconds();
					ms = '' + today.getMilliseconds();

				if ( mm.length == 1 ) {
					mm = '0' + mm;
				}

				var time = dd + '.' + mm + '.' + yyyy + '_' + h + '.' + m + '.' + s + '.' + ms + '_';
				fs.writeFile(folder + time + index + '.jpg', image, 'base64', function(error) {
					if ( error ) {
						return console.log(error);
					}
					else {
						image = folder + time + index + '.jpg';

						var album = new AlbumModel({title: photos[index].title, desc: photos[index].desc, image: image, parent: photos[index].parent, tags: photos[index].tags, id: photos[index].id, parentUrl: photos[index].parentUrl});

						album.save(function() {
							index ++;
							createImage(length);
						});
					}
				});
			}
			else {
				AlbumModel.findOne({'image': photos[index].image}, function(error, data) {
					data.title = photos[index].title;
					data.desc = photos[index].desc;
					data.tags = photos[index].tags;
					data.id = photos[index].id;
					data.parentUrl = photos[index].parentUrl;
					index ++;
					data.save();
					createImage(length);
				});
			}
			if ( index == length - 1 ) {
				setTimeout(function() {
					callback();
				}, 1000);
			}
		}
	}
}
Album.removePhoto = function(photo, callback) {
	if ( photo.indexOf('data:image') == -1 ) {
		fs.unlinkSync(photo);
	}
	AlbumModel.findOne({'image': photo}).remove().exec();
}
Album.removePhotos = function(parent, folder, callback) {
	AlbumModel.find({'parent': parent}, function() {
		folder = folder.split('').reverse().join('');
		folder = folder.substr(0, folder.indexOf('/'));
		folder = folder.substr(folder.indexOf('.') + 1, folder.length);
		folder = folder.split('').reverse().join('');
		folder = './uploads/albums/' + folder;

		var files = fs.readdirSync(folder);
		for ( file in files ) {
			fs.unlinkSync(folder + '/' + files[file]);
		}
	});
	setTimeout(function() {
		AlbumModel.find({'parent': parent}).remove().exec();
	}, 0);
}
Album.updateParent = function(origParent, parent) {
	AlbumModel.find({'parent': origParent}, function(error, data) {
		for ( i in data ) {
			data[i].parent = parent;
			data[i].save();
		}
	});
}
module.exports = Album;
