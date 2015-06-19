var io = require('socket.io'),
	dashboard = require('./admin/pages/dashboard'),
	photos = require('./admin/pages/photos'),
	album = require('./admin/pages/album'),
	tagsModel = require('./admin/pages/tags');

var Socket = function(server) {
	var connection = io.listen(server),
		self = this;

	connection.sockets.on('connection', function(socket) {
		socket.on('load dashboard', function(item) {
			dashboard.getHome(item, function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('dashboard loaded', data);
				}
			});
		});
		socket.on('update dashboard', function(item, img, title, desc) {
			dashboard.updateHome(item, img, title, desc, function(error, data) {
				socket.emit('dashboard updated', data);
			});
		});

		socket.on('load photos', function() {
			photos.getPhotos(function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('photos loaded', data);
				}
			});
		});
		socket.on('add album', function(title, desc, img, tags) {
			photos.validateAlbum(title, '', function(error, resp) {
				if ( error != null ) {
					// Error
				}
				else if ( resp != null ) {
					socket.emit('album exists');
				}
				else {
					photos.addAlbum(title, desc, img, tags, function(error, data) {
						if ( tags.length ) {
							tagsModel.addTag(tags, function() {
								tagsModel.getTags(function(error, data) {
									//console.log(data);
								});
							});
						}
						socket.emit('album added', data);
					});
				}
			});
		});
		socket.on('update album', function(album, originalTitle) {
			photos.validateAlbum(album.title, originalTitle, function(error, resp) {
				if ( error != null ) {
					// Error
				}
				else if ( resp != null ) {
					socket.emit('album exists');
				}
				else {
					photos.updateAlbum(album, function(error, data) {
						if ( album.tags.length ) {
							tagsModel.addTag(album.tags, function() {
								tagsModel.getTags(function(error, data) {
									//console.log(data);
								});
							});
						}
						socket.emit('album updated', data);
					});
				}
			});
		});
		socket.on('remove album', function(url) {
			photos.removeAlbum(url);
		});
		socket.on('load album', function(url) {
			photos.getAlbum(url, function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('album loaded', data);
				}
			});
		});
		socket.on('load tags', function() {
			tagsModel.getTags(function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('tags loaded', data);
				}
			});
		});
	});
};

module.exports = Socket;
