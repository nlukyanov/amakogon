var mongoose = require('mongoose'),
	fs = require('fs'),
	schema = {
		'title': String,
		'thumb': String,
		'synopsis': String,
		'post': String,
		'published': Boolean,
		'url': String
	},
	BlogModel = mongoose.model('blog', schema);

var Blog = function() {};

Blog.transliterate = function(text) {
	var trans = {"І":"I","Ї":"II","Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","і":"i","ї":"ii","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu","'":"'"};

	return text.split('').map(function (char) {
		return trans[char] || char; 
	}).join('').replace(/ /g, '_').replace(/,/g, '').replace(/'/g, '').toLowerCase();
}

Blog.getBlog = function(callback) {
	BlogModel.find({}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}

Blog.getPost = function(url, callback) {
	BlogModel.findOne({'url': url}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}

Blog.validatePost = function(title, originalTitle, callback) {
	var self = this,
		url = self.transliterate(title);

	if ( title == originalTitle ) {
		callback(null, null);
	}
	else {
		BlogModel.findOne({'url': url}, function(error, resp) {
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

Blog.createPost = function(title, synopsis, image, callback) {
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

	if ( image.indexOf('data:image') != -1 ) {
		var image = image.replace(/^data:image\/(jpg|jpeg);base64,/,''),
			time = dd + '.' + mm + '.' + yyyy + '_' + h + '.' + m + '.' + s;

		fs.writeFile('./uploads/blog/' + time + '_' + url + '.jpg', image, 'base64', function(error) {
			if ( error ) {
				return console.log(error);
			}
			else {
				image = './uploads/blog/' + time + '_' + url + '.jpg';

				var blog = new BlogModel({'title': title, 'synopsis': synopsis, 'thumb': image, 'url': url, 'published': false});

				blog.save(function(error, data) {
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
		var blog = new BlogModel({'title': title, 'synopsis': synopsis, 'thumb': image, 'url': url, 'published': false});

		blog.save(function(error) {
			if ( error ) {
				callback(error);
			}
			else {
				callback(null, url);
			}
		});
	}
}
Blog.updatePost = function(post, callback) {
	var self = this;

	post.url = self.transliterate(post.title);

	if ( post.thumb && post.thumb.indexOf('data:image') == 0 ) {
		var image = post.thumb.replace(/^data:image\/(jpg|jpeg);base64,/,'');
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

		BlogModel.findOne({'_id': post._id}, function(error, data) {
			fs.unlinkSync(data.thumb);
		});
		fs.writeFile('./uploads/blog/' + time + post.url + '.jpg', image, 'base64', function(error) {
			image = './uploads/blog/' + time + post.url + '.jpg';
			if ( error ) {
				return console.log(error);
			}
			else {
				BlogModel.findOne({'_id': post._id}, function(error, data) {
					data.title = post.title;
					data.url = post.url;
					data.synopsis = post.synopsis;
					data.thumb = image;
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
		BlogModel.findOne({'_id': post._id}, function(error, data) {
			data.title = post.title;
			data.url = post.url;
			data.synopsis = post.synopsis;
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

Blog.removePost = function(url, callback) {
	BlogModel.findOne({'url': url}, function(error, data) {
		fs.unlinkSync(data.thumb);
	});
	setTimeout(function() {
		BlogModel.findOne({'url': url}).remove().exec();
	}, 0);
}

Blog.publishPost = function(url, callback) {
	BlogModel.findOne({'url': url}, function(error, data) {
		data.published = !data.published;
		data.save(function(error, data) {
			callback(data);
		});
	});
}

Blog.getPost = function(url, callback) {
	BlogModel.findOne({'url': url}, function(error, data) {
		if ( error !== null ) {
			callback(error);
		}
		else {
			callback(error, data);
		}
	});
}

module.exports = Blog;
