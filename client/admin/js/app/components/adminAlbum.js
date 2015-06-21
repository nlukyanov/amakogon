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
				originalTags = [],
				originalDesc = '',
				originalPhotos = [];

			scope.newTag = '';
			scope.showTags = false;
			scope.hasPhotos = false;
			scope.photosUpdated = false;

			scope.album = '';
			socket.emit('load album', url);
			socket.off('album loaded').on('album loaded', function(data) {
				if ( data ) {
					originalTitle = data.title;
					originalDesc = data.desc;
					originalImg = data.image;
					scope.album = data;
					for ( tag in data.tags ) {
						originalTags.push(data.tags[tag]);
					}
				}
				else {
					$location.path('/admin/photos/');
				}
				socket.emit('load album photos', data.title);
				socket.off('album photos loaded').on('album photos loaded', function(data) {
					scope.photos = data;
					for ( i in data ) {
						originalPhotos.push(data[i]);
					}
					if ( scope.photos.length ) {
						scope.hasPhotos = true;
					}
					scope.$apply();
				});
			});

			scope.canAddTag = false;
			scope.isUpdated = false;

			scope.$watchCollection('album', function() {
				if ( scope.album ) {
					scope.isUpdated = scope.album.title != originalTitle || scope.album.desc != originalDesc || scope.album.image != originalImg;
				}
			});
			socket.emit('load tags');
			socket.on('tags loaded', function(data) {
				scope.exTags = data;
			});

			scope.changeShowTags = function(val) {
				$timeout(function() {
					scope.showTags = val;
				}, 100);
			};

			scope.chooseTag = function(tag) {
				element.find('#newAlbumTags').val(tag);
				$timeout(function() {
					element.find('#addTag').trigger('click');
				}, 100);
			};

			scope.enterTag = function(e) {
				var tagInput = $(e.target);

				if ( tagInput.val() ) {
					scope.canAddTag = true;
				}
				else {
					scope.canAddTag = false;
				}
			};

			scope.addTag = function(e) {
				e.preventDefault();
				var tag = element.find('#newAlbumTags').val();

				if ( !scope.canAddTag ) {
					return false;
				}

				if ( scope.album.tags.indexOf(tag) > -1 ) {
					alert('У этого альбома уже есть такой тег');
					element.find('#newAlbumTags').val('').focus();
				}
				else {
					scope.album.tags.push(tag);
					element.find('#newAlbumTags').val('').focus();
					scope.isUpdated = true;
					scope.newTag = '';
					$timeout(function() {
						scope.canAddTag = false;
					}, 100);
				}
			};

			scope.removeTag = function(e, tag) {
				e.preventDefault();
				var index = scope.album.tags.indexOf(tag);

				scope.album.tags.splice(index, 1);
				scope.isUpdated = true;
			};

			scope.updateAlbum = function(e) {
				e.preventDefault();
				if ( scope.isUpdated ) {
					scope.isUpdated = false;
					$(e.target).closest('.admin-form').find('.item-overlay').addClass('saving');
					socket.emit('update album', scope.album, originalTitle);
				}
			};

			socket.off('album exists').on('album exists', function() {
				alert('Альбом с похожим названием уже существует!');
				$timeout(function() {
					element.find('.item-overlay').removeClass('saving');
				}, 500);
			});
			socket.off('album updated').on('album updated', function(data) {
				$location.path($location.path().substr(0, $location.path().indexOf('/admin/photos/') + 14) + data.url);
				$timeout(function() {
					element.find('.item-overlay').removeClass('saving');
				}, 500);
				originalTitle = data.title;
				originalDesc = data.desc;
				originalImg = data.image;
				scope.album = data;
				for ( tag in data.tags ) {
					originalTags.push(data.tags[tag]);
				}
				scope.$apply();
			});

			scope.triggerUpload = function(e) {
				var item = $(e.target).closest('.album-info'),
					input = item.find('input[type="file"]');

				$timeout(function() {
					input.trigger('click');
				}, 100);
			};

			element.find('#newAlbumPhoto').on('change', function(e) {
				var reader = new FileReader();

				reader.onload = function (e) {
					scope.album.image = e.target.result;
					scope.$apply();
				}

				reader.readAsDataURL($(e.currentTarget)[0].files[0]);
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
			}
			element.find('#newPhotos').on('change', function(e) {
				var files = $(e.currentTarget)[0].files;

				scope.loadingFile = 0;

				scope.$watch('loadingFile', function() {
					if ( scope.loadingFile == 0 ) {
						$('body').addClass('no-events');
					}
					if ( scope.loadingFile == files.length - 1 ) {
						$('body').removeClass('no-events');
					}
				});

				scope.addImage(files, files.length);
				scope.photosUpdated = true;
			});
			scope.addImage = function(el, length) {
				if ( scope.loadingFile <= length ) {
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
								height = k
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

							scope.photos.push({'image': shrinked, 'title': '', 'desc': '', 'parent': scope.album.title});
							scope.hasPhotos = true;
							scope.$apply();

							scope.loadingFile ++;
							scope.addImage(el, length);
							$(window).scrollTop(9999);
						});
					}
					if ( el[scope.loadingFile] ) {
						reader.readAsDataURL(el[scope.loadingFile]);
					}
				}
			};

			scope.updatePhotos = function(e, parent, folder) {
				e.preventDefault();

				if ( scope.photosUpdated ) {
					scope.photosUpdated = false;
					socket.emit('update album photos', parent, folder, scope.photos);
					element.find('.admin-album-list .item-overlay').addClass('saving');
					socket.off('album photos updated').on('album photos updated', function() {
						$timeout(function() {
							element.find('.admin-album-list .item-overlay').removeClass('saving');
						}, 500);
					});
				}
			};

			scope.removePhoto = function(e, photo, photoArr) {
				e.preventDefault();
				var target = $(e.target);
				if ( confirm('Вы точно хотите удалить эту фотографию?') ) {
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
				if ( confirm('Вы точно хотите удалить все фотографии в альбоме?') ) {
					target.closest('.admin-album').find('li').not('.new-album').remove();
					scope.hasPhotos = false;
					scope.photos = [];
					socket.emit('remove album photos', parent, folder);
					element.find('#newPhotos').replaceWith(element.find('#newPhotos').clone(true));
				}
			};

			scope.$watchCollection('photos', function() {
				if ( scope.photos ) {
					for ( x in scope.photos ) {
						for ( y in originalPhotos ) {
							if ( scope.photos[x].title != originalPhotos[y].title || scope.photos[x].desc != originalPhotos[y].desc ) {
								scope.photosUpdated = true;
							}
						}
					}
				}
			});
		};
	});

})();