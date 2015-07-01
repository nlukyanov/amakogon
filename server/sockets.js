var io = require('socket.io'),
	dashboardModel = require('./admin/pages/dashboard'),
	photosModel = require('./admin/pages/photos'),
	albumModel = require('./admin/pages/album'),
	tagsModel = require('./admin/pages/tags'),
	mapModel = require('./admin/pages/map'),
	contactModel = require('./admin/pages/contact'),
	blogModel = require('./admin/pages/blog');

var Socket = function(server) {
	var connection = io.listen(server),
		self = this;

	connection.sockets.on('connection', function(socket) {
		socket.on('load dashboard', function(item) {
			dashboardModel.getHome(item, function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('dashboard loaded', data);
				}
			});
		});

		socket.on('update dashboard', function(item, img, title, desc) {
			dashboardModel.updateHome(item, img, title, desc, function(error, data) {
				socket.emit('dashboard updated', data);
			});
		});

		socket.on('load photos', function() {
			photosModel.getPhotos(function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('photos loaded', data);
				}
			});
		});

		socket.on('add album', function(title, desc, img, tags) {
			photosModel.validateAlbum(title, '', function(error, resp) {
				if ( error != null ) {
					// Error
				}
				else if ( resp != null ) {
					socket.emit('album exists');
				}
				else {
					photosModel.addAlbum(title, desc, img, tags, function(error, data) {
						if ( tags.length ) {
							tagsModel.addTag(tags, function() {
								tagsModel.getTags(function(error, data) {
									// callback
								});
							});
						}
						socket.emit('album added', data);
					});
				}
			});
		});

		socket.on('update album', function(album, originalTitle) {
			photosModel.validateAlbum(album.title, originalTitle, function(error, resp) {
				if ( error != null ) {
					// Error
				}
				else if ( resp != null ) {
					socket.emit('album exists');
				}
				else {
					photosModel.updateAlbum(album, function(error, data) {
						if ( album.tags.length ) {
							tagsModel.addTag(album.tags, function() {
								tagsModel.getTags(function(error, data) {
									socket.emit('tags loaded', data);
								});
							});
						}
						socket.emit('album updated', data);
					});
					albumModel.updateParent(originalTitle, album.title);
				}
			});
		});

		socket.on('remove album', function(url, title, folder) {
			photosModel.removeAlbum(url);
			albumModel.removePhotos(title, folder);
		});

		socket.on('load album', function(url) {
			photosModel.getAlbum(url, function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('album loaded', data);
				}
			});
		});

		socket.on('load album photos', function(parent) {
			albumModel.getPhotos(parent, function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('album photos loaded', data);
				}
			});
		});

		socket.on('update album photos', function(parent, folder, photos) {
			albumModel.updatePhotos(parent, folder, photos, function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					albumModel.getPhotos(parent, function(error, data) {
						var photos = data;
						if ( error != null ) {
							// === Error Handling
						}
						else {
							var index = 0;

							addTags(data.length);

							function addTags(length) {
								if ( index < length ) {
									if ( data[index].tags.length ) {
										tagsModel.addTag(data[index].tags, function() {
											index ++;
											addTags(length);
										});
									}
									else {
										index ++;
										addTags(length);
									}
									if ( index == length - 1 ) {
										tagsModel.getTags(function(error, data) {
											socket.emit('tags loaded', data);
											socket.emit('album photos loaded', photos);
										});
									}
								}
								else {
									tagsModel.getTags(function(error, data) {
										socket.emit('tags loaded', data);
										socket.emit('album photos loaded', photos);
									});
								}
							}
						}
					});
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

		socket.on('remove album photo', function(photo) {
			albumModel.removePhoto(photo);
		});

		socket.on('remove album photos', function(parent, folder) {
			albumModel.removePhotos(parent, folder);
		});

		socket.on('load albums by tag', function(tag) {
			photosModel.getPhotosByTag(tag, function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('albums by tag loaded', data);
				}
			});
		});

		socket.on('load photos by tag', function(tag) {
			albumModel.getPhotosByTag(tag, function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('photos by tag loaded', data);
				}
			});
		});

		socket.on('check tags', function(tag) {
			photosModel.checkPhotosByTag(tag, function(album) {
				albumModel.checkPhotosByTag(tag, function(photos) {
					socket.emit('tags checked', album, photos);
				});
			});
		});

		socket.on('publish album', function(url) {
			photosModel.publishAlbum(url, function(data) {
				connection.sockets.emit('album published', data);
			});
			albumModel.publishAlbum(url);
		});

		socket.on('remove tag', function(tag) {
			tagsModel.removeTag(tag, function() {
				photosModel.removeTag(tag, function() {
					albumModel.removeTag(tag, function() {
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
			});
		});

		socket.on('add tag', function(tag) {
			tagsModel.addTag(tag, function() {
				tagsModel.getTags(function(error, data) {
					// callback
				});
			});
		});

		socket.on('load map', function() {
			mapModel.getMap(function(error, data) {
				if ( error != null ) {
					// === Error
				}
				else {
					socket.emit('map loaded', data);
				}
			});
		});

		socket.on('update map', function(data) {
			mapModel.updateMap(data, function(error, data) {
				socket.emit('map updated');
			});
		});

		socket.on('load contact', function() {
			contactModel.getContact(function(error, data) {
				if ( error != null ) {
					// === Error
				}
				else {
					socket.emit('contact loaded', data);
				}
			});
		});

		socket.on('update partially contact', function(data) {
			contactModel.updatePartContact(data, function(error, data) {
				contactModel.getContact(function(error, data) {
					if ( error != null ) {
						// === Error
					}
					else {
						socket.emit('contact loaded', data);
					}
				});
			});
		});

		socket.on('update contact', function(data) {
			contactModel.updateContact(data, function(error, data) {
				contactModel.getContact(function(error, data) {
					if ( error != null ) {
						// === Error
					}
					else {
						socket.emit('contact loaded', data);
					}
				});
			});
		});

		socket.on('load blog', function() {
			blogModel.getBlog(function(error, data) {
				if ( error != null ) {
					// === Error
				}
				else {
					socket.emit('blog loaded', data);
				}
			});
		});

		socket.on('create post', function(title, synopsis, image) {
			blogModel.validatePost(title, '', function(error, data) {
				if ( error != null ) {

				}
				else if ( data != null ) {
					socket.emit('post exists');
				}
				else {
					blogModel.createPost(title, synopsis, image, function(error, data) {
						if ( error != null ) {
							// === Error
						}
						else {
							blogModel.getPost(data, function(error, data) {
								if ( error != null ) {
									// === Error
								}
								else {
									socket.emit('post added', data.url);
								}
							});
						}
					});
				}
			});
		});

		socket.on('remove post', function(url, title, folder) {
			blogModel.removePost(url);
		});

		socket.on('update post', function(post, originalTitle) {
			blogModel.validatePost(post.title, originalTitle, function(error, resp) {
				if ( error != null ) {
					// Error
				}
				else if ( resp != null ) {
					socket.emit('post exists');
				}
				else {
					blogModel.updatePost(post, function(error, data) {
						blogModel.getBlog(function(error, data) {
							if ( error != null ) {
								// === Error
							}
							else {
								setTimeout(function() {
									socket.emit('blog loaded', data);
									socket.emit('post updated', data);
								}, 500);
							}
						});
					});
				}
			});
		});

		socket.on('publish post', function(url) {
			blogModel.publishPost(url, function(data) {
				connection.sockets.emit('post published', data);
			});
		});

		socket.on('load post', function(url) {
			blogModel.getPost(url, function(error, data) {
				if ( error !== null ) {

				}
				else {
					socket.emit('post loaded', data);
				}
			});
		});
	});
};

module.exports = Socket;
