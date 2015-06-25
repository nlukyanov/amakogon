(function() {

	var adminAlbum = angular.module('adminAlbum', []);

	adminAlbum.directive('adminAlbum', function($http, $location, $timeout) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			var url = $location.path().substr($location.path().indexOf('/admin/photos/') + 14, $location.path().length),
				originalTitle = '',
				originalImg = '',
				originalDesc = '',
				originalPhotos = [];

			scope.hasPhotos = false;
			scope.photosUpdated = false;
			scope.albumTagsChanged = false;
			scope.photoTagsChanged = false;
			scope.showSpinner = false;
			scope.showAlbumSpinner = false;

			socket.emit('load album', url);
			socket.off('album loaded').on('album loaded', function(data) {
				if ( data ) {
					originalTitle = data.title;
					originalDesc = data.desc;
					originalImg = data.image;
					scope.album = data;
				}
				else {
					$location.path('/admin/photos/');
				}
				socket.emit('load album photos', data.title);
				socket.off('album photos loaded').on('album photos loaded', function(data) {
					scope.photos = data;
					originalPhotos = angular.copy(scope.photos);
					if ( scope.photos.length ) {
						scope.hasPhotos = true;
					}
					$('.item-overlay').removeClass('saving');
					$('body').removeClass('isModal');
					scope.$apply();

					var hash = $location.hash();

					$timeout(function() {
						if ( hash ) {
							$('.' + hash).trigger('click');
						}
					}, 0);
				});
			});
			scope.$on('modal open', function(e, newHash) {
				$location.hash(newHash);
			});
			scope.$on('modal closed', function() {
				$location.hash('');
			});
			scope.$on('modal prev', function(e, newHash) {
				$location.hash(newHash);
			});
			scope.$on('modal next', function(e, newHash) {
				$location.hash(newHash);
			});

			scope.isUpdated = false;

			scope.$watchCollection('album', function() {
				if ( scope.album ) {
					scope.isUpdated = scope.album.title != originalTitle || scope.album.desc != originalDesc || scope.album.image != originalImg;
				}
			});

			scope.updateAlbum = function(e) {
				e.preventDefault();
				if ( scope.isUpdated || scope.albumTagsChanged ) {
					scope.isUpdated = false;
					socket.emit('update album', scope.album, originalTitle);
					$(e.target).closest('.admin-form').find('.item-overlay').addClass('saving');
				}
			};

			socket.off('album exists').on('album exists', function() {
				alert('Альбом с похожим названием уже существует!');
				element.find('.item-overlay').removeClass('saving');
			});
			socket.off('album updated').on('album updated', function(data) {
				$timeout(function() {
					$location.path($location.path().substr(0, $location.path().indexOf('/admin/photos/') + 14) + data.url);
					element.find('.item-overlay').removeClass('saving');
					originalTitle = data.title;
					originalDesc = data.desc;
					originalImg = data.image;
					scope.album = data;
					scope.$apply();
				}, 500);
			});

			scope.triggerUpload = function(e) {
				var input = $(e.currentTarget).next('input[type="file"]');

				$timeout(function() {
					input.trigger('click');
				}, 100);
			};

			element.find('#newAlbumPhoto').on('change', function(e) {
				scope.showAlbumSpinner = true;
				$timeout(function() {
					var reader = new FileReader();

					reader.onload = function (e) {
						scope.album.image = e.target.result;
						scope.showAlbumSpinner = false;
						scope.$apply();
					};

					reader.readAsDataURL($(e.currentTarget)[0].files[0]);
				}, 100);
			});

			scope.removeAlbum = function(e, url, title, image) {
				e.preventDefault();
				if ( confirm('Вы уверены, что хотите удалить альбом "' + title + '"') ) {
					socket.emit('remove album', url, title, image);
					$location.path('/admin/photos');
					$timeout(function() {
						scope.$apply();
					}, 0);
				}
			};

			scope.triggerPhotosUpload = function(e) {
				e.preventDefault();

				var photosInput = element.find('#newPhotos');

				photosInput.trigger('click');
			};

			element.find('#newPhotos').on('change', function(e) {
				var files = $(e.currentTarget)[0].files;

				scope.loadingFile = 0;

				scope.$watch('loadingFile', function() {
					if ( scope.loadingFile === 0 ) {
						$('body').addClass('no-events');
					}
					if ( scope.loadingFile == files.length - 1 ) {
						$('body').removeClass('no-events');
					}
				});

				scope.showSpinner = true;
				$timeout(function() {
					scope.newLength = files.length;
					scope.currentLength = 1;
					scope.addImage(files, files.length);
					scope.photosUpdated = true;
				}, 0);
			});
			scope.addImage = function(el, length) {
				if ( scope.loadingFile <= length ) {
					scope.currentLength = scope.loadingFile + 1;
					$timeout(function() {
						var reader = new FileReader(),
							image = document.createElement('img'),
							k = 2560,
							width = 0,
							height = 0;

						reader.onload = function (e) {

							image.src = e.target.result;

							$(image).on('load', function() {
								if ( image.width > image.height ) {
									width = k;
									height = k * image.height / image.width;
								}
								else if ( image.width < image.height ) {
									height = k;
									width = k * image.width / image.height;
								}
								else {
									width = height = k;
								}

								var canvas = document.createElement('canvas');

								canvas.width = width;
								canvas.height = height;

								var ctx = canvas.getContext('2d');
								ctx.drawImage(image, 0, 0, width, height);
								var shrinked = canvas.toDataURL('image/jpeg');

								scope.photos.push({'image': shrinked, 'title': '', 'desc': '', 'parent': scope.album.title, 'id': scope.photos.length, 'parentUrl': scope.album.url});
								scope.hasPhotos = true;
								scope.$apply();

								$(window).scrollTop(9999);
								$timeout(function() {
									scope.loadingFile ++;
									scope.addImage(el, length);
								}, 0);
							});
						};
						if ( el[scope.loadingFile] ) {
							reader.readAsDataURL(el[scope.loadingFile]);
						}
						if ( scope.loadingFile == length - 1 ) {
							scope.showSpinner = false;
						}
					}, 100);
				}
			};

			scope.updatePhotos = function(e, parent, folder) {
				e.preventDefault();
				if ( scope.photosUpdated || $('.changed', element).length ) {
					scope.photosUpdated = false;
					socket.emit('update album photos', parent, folder, scope.photos);
					originalPhotos = angular.copy(scope.photos);
					element.find('.admin-album-list .item-overlay').addClass('saving');
					$timeout(function() {
						$('.changed').removeClass('changed');
						$location.hash('');
					}, 0);
				}
			};

			scope.removePhoto = function(e, photo, photoArr) {
				e.preventDefault();
				var target = $(e.target);
				if ( confirm('Вы уверены, что хотите безвозвратно удалить эту фотографию?') ) {
					if ( target.closest('.admin-album').find('li').not('.new-album').length == 1 ) {
						scope.hasPhotos = false;
					}
					target.closest('li').remove();
					scope.photos.splice(scope.photos.indexOf(photoArr), 1);
					socket.emit('remove album photo', photo);
				}
			};

			scope.removeAllPhotos = function(e, parent, folder) {
				e.preventDefault();
				var target = $(e.target);
				if ( confirm('Вы уверены, что хотите безвозвратно удалить все фотографии в альбоме?') ) {
					target.closest('.admin-album').find('li').not('.new-album').remove();
					scope.hasPhotos = false;
					scope.photos = [];
					socket.emit('remove album photos', parent, folder);
					element.find('#newPhotos').replaceWith(element.find('#newPhotos').clone(true));
				}
			};

			scope.checkIfUpdated = function() {
				if ( scope.photos.length == originalPhotos.length ) {
					var changed = false;

					for ( var x in scope.photos ) {
						if ( scope.photos[x] ) {
							for ( var y in originalPhotos ) {
								if ( originalPhotos[y] ) {
									if ( scope.photos[x].title === undefined ) {
										scope.photos[x].title = '';
									}
									if ( scope.photos[x].desc === undefined ) {
										scope.photos[x].desc = '';
									}
									if ( x == y ) {
										if ( scope.photos[x].title !== originalPhotos[y].title || scope.photos[x].desc !== originalPhotos[y].desc ) {
											changed = true;
										}
									}
								}
							}
						}
					}
					scope.photosUpdated = changed;
				}
			};

			scope.$on('tags changed', function() {
				$timeout(function() {
					if ( $('.changed', element).length ) {
						scope.photosUpdated = true;
					}
					else {
						scope.checkIfUpdated();
					}
				}, 0);
			});

			scope.album_publishAlbum = function(e, album) {
				e.preventDefault();
				if ( album.published === false ) {
					if ( confirm('Вы уверены, что хотите опубликовать этот альбом?') ) {
						socket.emit('publish album', album.url);
						album.published = !album.published;
					}
				}
				else {
					if ( confirm('Вы уверены, что хотите отправить этот альбом в черновики?') ) {
						socket.emit('publish album', album.url);
						album.published = !album.published;
					}
				}
			};
			scope.$on('$locationChangeStart', function(e) {
				if ( scope.isUpdated || scope.albumTagsChanged || scope.photosUpdated || $('.changed', element).length ) {
					if ( !confirm('Некоторые изменения не были сохранены. Действительно обновить эту страницу?') ) {
						e.preventDefault();
					}
				}
			});
			window.onbeforeunload = function (e) {
				if ( scope.isUpdated || scope.albumTagsChanged || scope.photosUpdated || $('.changed', element).length ) {
					return 'Некоторые изменения не были сохранены.';
				}
			}
		}
	});

})();