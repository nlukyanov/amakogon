var mongoose = require('mongoose'),
	fs = require('fs'),
	schema = {
		'title': String,
		'desc': String,
		'image': String,
		'url': String,
		'date': String,
		'tags': []
	},
	PhotosModel = mongoose.model('photos', schema);

var Photos = function() {};

Photos.getPhotos = function(callback) {
	PhotosModel.find({}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}
Photos.getAlbum = function(url, callback) {
	PhotosModel.findOne({'url': url}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}
Photos.validateAlbum = function(title, originalTitle, callback) {
	var self = this,
		url = self.transliterate(title);

	if ( title == originalTitle ) {
		callback(null, null);
	}
	else {
		PhotosModel.findOne({'url': url}, function(error, resp) {
			if ( error != null ) {
				callback(error);
			}
			else {
				if ( resp != null ) {
					callback(null, resp);
				}
				else {
					callback(null, null);
				}
			}
		});
	}
}
Photos.transliterate = function(text) {
	var trans = {"І":"I","Ї":"II","Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","і":"i","ї":"ii","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu","'":"'"};

	return text.split('').map(function (char) {
		return trans[char] || char; 
	}).join('').replace(/ /g, '_').replace(/,/g, '').replace(/'/g, '').toLowerCase();
}
Photos.addAlbum = function(title, desc, img, tags, callback) {
	var self = this,
		url = self.transliterate(title);

	var today = new Date(),
		dd = '' + today.getDate(),
		mm = '' + today.getMonth(),
		yyyy = '' + today.getFullYear(),
		h = '' + today.getHours(),
		m = '' + today.getMinutes(),
		s = '' + today.getSeconds();

	if ( mm.length == 1 ) {
		mm = '0' + mm;
	}
	if ( img ) {
		var image = img.replace(/^data:image\/(jpg|jpeg);base64,/,'');

		fs.mkdirSync('./uploads/albums/' + dd + '.' + mm + '.' + yyyy + '_' + h + '.' + m + '.' + s + '_' + url);
		fs.writeFile('./uploads/photos/' + dd + '.' + mm + '.' + yyyy + '_' + h + '.' + m + '.' + s + '_' + url + '.jpg', image, 'base64', function(error) {
			if ( error ) {
				return console.log(error);
			}
			else {
				image = './uploads/photos/' + dd + '.' + mm + '.' + yyyy + '_' + h + '.' + m + '.' + s + '_' + url + '.jpg';

				var album = new PhotosModel({title: title, desc: desc, image: image, url: url, date: dd + '.' + mm + '.' + yyyy, tags: tags});

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
		var album = new PhotosModel({title: title, desc: desc, image: image, url: url, date: dd + '.' + mm + '.' + yyyy, tags: tags});

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
Photos.updateAlbum = function(album, callback) {
	var self = this;

	album.url = self.transliterate(album.title);

	if ( album.image && album.image.indexOf('data:image') == 0 ) {
		var image = album.image.replace(/^data:image\/(jpg|jpeg);base64,/,'');
		var today = new Date(),
			dd = '' + today.getDate(),
			mm = '' + today.getMonth(),
			yyyy = '' + today.getFullYear(),
			h = '' + today.getHours(),
			m = '' + today.getMinutes(),
			s = '' + today.getSeconds();

		if ( mm.length == 1 ) {
			mm = '0' + mm;
		}

		var time = dd + '.' + mm + '.' + yyyy + '_' + h + '.' + m + '.' + s + '_';

		PhotosModel.findOne({'_id': album._id}, function(error, data) {
			fs.unlinkSync(data.image);
		});
		fs.writeFile('./uploads/photos/' + time + album.url + '.jpg', image, 'base64', function(error) {
			image = './uploads/photos/' + time + album.url + '.jpg';
			if ( error ) {
				return console.log(error);
			}
			else {
				PhotosModel.findOne({'_id': album._id}, function(error, data) {
					data.title = album.title;
					data.url = album.url;
					data.desc = album.desc;
					data.image = image;
					data.tags = album.tags;
					data.save(function(error, data) {
						if ( error ) {
							callback(error);
						}
						else {
							callback(null, data)
						}
					});
				});
			}
		});
	}
	else {
		PhotosModel.findOne({'_id': album._id}, function(error, data) {
			data.title = album.title;
			data.url = album.url;
			data.desc = album.desc;
			data.tags = album.tags;
			data.save(function(error, data) {
				if ( error ) {
					callback(error);
				}
				else {
					callback(null, data)
				}
			});
		});
	}
}
Photos.removeAlbum = function(url, callback) {
	PhotosModel.findOne({'url': url}, function(error, data) {
		fs.unlinkSync(data.image);
		
		var folder = data.image;

		folder = folder.split('').reverse().join('');
		folder = folder.substr(0, folder.indexOf('/'));
		folder = folder.substr(folder.indexOf('.') + 1, folder.length);
		folder = folder.split('').reverse().join('');
		folder = './uploads/albums/' + folder;

		var files = fs.readdirSync(folder);
		for ( file in files ) {
			fs.unlinkSync(folder + '/' + files[file]);
		}
		fs.rmdir(folder);
	});
	setTimeout(function() {
		PhotosModel.findOne({'url': url}).remove().exec();
	}, 0);
}
module.exports = Photos;
