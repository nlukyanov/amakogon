(function() {

	var adminPhotos = angular.module('adminPhotos', []);

	adminPhotos.directive('adminPhotos', function($http, $location, $timeout, $rootScope, pageTitle) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			pageTitle.setTitle('Фотографии');
			scope.canSave = false;
			scope.hasImage = false;
			scope.canAddTag = false;
			scope.tags = [];
			scope.newTag = '';
			scope.showTags = false;
			scope.showSpinner = false;

			scope.changeShowTags = function(val) {
				$timeout(function() {
					scope.showTags = val;
				}, 100);
			};

			scope.enterTitle = function(e) {
				var textInput = $(e.target);

				if ( textInput.val() ) {
					scope.canSave = true;
				}
				else {
					scope.canSave = false;
				}
			};

			scope.chooseTag = function(tag) {
				element.find('#newAlbumTags').val(tag);
				$timeout(function() {
					element.find('#addTag').trigger('click');
				}, 100);
			};

			scope.exTagIndex = -1;

			scope.enterTag = function(e) {
				if ( e.keyCode == 38) {
					e.preventDefault();
					if ( scope.exTagIndex > 0 ) {
						scope.exTagIndex --;
					}
					$timeout(function() {
						if ( $('.ex-tags .active', element).length ) {
							$('.ex-tags', element).scrollTop($('.ex-tags .active', element).position().top + $('.ex-tags', element).scrollTop());
						}
					}, 0);
				}
				else if ( e.keyCode == 40) {
					e.preventDefault();

					if ( scope.exTagIndex < $('.ex-tags', element).children().length - 1 ) {
						scope.exTagIndex ++;
					}
					$timeout(function() {
						if ( $('.ex-tags .active', element).length ) {
							$('.ex-tags', element).scrollTop($('.ex-tags .active', element).position().top + $('.ex-tags', element).scrollTop());
						}
					}, 0);
				}
				else if ( e.keyCode == 13 ) {
					e.preventDefault();
					if ( $('.ex-tags .active', element).length ) {
						scope.addTag($('.ex-tags .active', element).text());
					}
					else {
						if ( scope.newTag ) {
							scope.addTag(scope.newTag);
						}
					}
				}
				else {
					scope.exTagIndex = -1;
					if ( $('.ex-tags .active', element).length ) {
						$('.ex-tags', element).scrollTop(0);
					}
					var tagInput = $(e.target);

					if ( tagInput.val() ) {
						scope.canAddTag = true;
					}
					else {
						scope.canAddTag = false;
					}
				}
			};

			var originalPhotos;

			socket.emit('load photos');
			socket.on('photos loaded', function(data) {
				scope.photos = data;
				originalPhotos = angular.copy(scope.photos);
				scope.$apply();
			});
			socket.emit('load tags');
			socket.on('tags loaded', function(data) {
				scope.exTags = data;
			});

			scope.addTag = function(e) {
				e.preventDefault();
				var tag = $('.ex-tags .active').text() || element.find('#newAlbumTags').val();

				if ( !scope.canAddTag ) {
					return false;
				}

				if ( scope.tags.indexOf(tag) > -1 ) {
					$rootScope.$broadcast('alert', 'У этого альбома уже есть такой тег!');

					scope.$on('message end', function() {
						element.find('#newAlbumTags').val('').focus();
					});
				}
				else {
					scope.tags.push(tag);
					element.find('#newAlbumTags').val('').focus();
					scope.newTag = '';
					$timeout(function() {
						scope.canAddTag = false;
					}, 100);
				}
			};

			scope.removeTag = function(e, tag) {
				e.preventDefault();
				var index = scope.tags.indexOf(tag);

				$timeout(function() {
					scope.tags.splice(index, 1);
				}, 0);
			}

			scope.addAlbum = function(e) {
				e.preventDefault();

				var title = element.find('#newAlbumTitle'),
					desc = element.find('#newAlbumDesc');

				if ( !scope.canSave || !scope.hasImage ) {
					return false;
				}
				scope.canSave = false;

				socket.emit('add album', title.val(), desc.val(), scope.newImage, scope.tags);
				socket.off('album exists').on('album exists', function() {
					$rootScope.$broadcast('alert', 'Альбом с похожим название уже существует!');

					scope.$on('message end', function() {
						$('#newAlbumTitle').val('');
						scope.canSave = true;
					});
				});
				socket.off('album added').on('album added', function(url) {
					$location.path($location.path() +  '/' + url);
					$('body').css({overflow: 'visible'});
					scope.$apply();
				});
			};

			scope.removeAlbum = function(e, url, title, image) {
				e.preventDefault();
				if ( confirm('Вы уверены, что хотите безвозвратно удалить альбом "' + title + '"') ) {
					socket.emit('remove album', url, title, image);
					$(e.currentTarget).closest('li').remove();
				}
			};

			scope.triggerUpload = function(e) {
				var input = $(e.currentTarget).next('input[type="file"]');

				$timeout(function() {
					input.trigger('click');
				}, 100);
			};

			element.find('input[type="file"]').on('change', function(e) {
				scope.showSpinner = true;
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

							scope.newImage = shrinked;
							scope.hasImage = true;
							scope.showSpinner = false;
							scope.$apply();
						});
					}

					reader.readAsDataURL($(e.currentTarget)[0].files[0]);
				}, 0);
			});

			scope.album_triggerUpload = function(e, target, album) {
				e.preventDefault();
					
				var input = element.find('#' + target);

				$timeout(function() {
					input.trigger('click');
				}, 100);
				input.on('change', function(e) {
					scope.showSpinner = true;
					$timeout(function() {
						var reader = new FileReader();

						reader.onload = function (e) {
							album.image = e.target.result;
							scope.imgUpdated = true;
							scope.showSpinner = false;
							scope.$apply();
						}

						reader.readAsDataURL($(e.currentTarget)[0].files[0]);
					}, 0);
				});
			};

			scope.album_checkIfUpdated = function(album) {
				for ( var i in originalPhotos ) {
					if ( originalPhotos[i]._id == album._id ) {
						scope.albumUpdated = originalPhotos[i].title != album.title || originalPhotos[i].desc != album.desc;
					}
				}
			};

			scope.album_updateAlbum = function(e, album) {
				e.preventDefault();
				var originalTitle = '';

				for ( var i in originalPhotos ) {
					if ( originalPhotos[i]._id == album._id ) {
						originalTitle = originalPhotos[i].title;
					}
				}
				if ( scope.albumUpdated || $('.changed', element).length || scope.imgUpdated ) {
					scope.albumUpdated = false;
					scope.imgUpdated = false;
					$('.changed').removeClass('.changed');
					socket.emit('update album', album, originalTitle);
					socket.on('album updated', function(data) {
						$(e.target).closest('.admin-form').find('.item-overlay').addClass('saving');
						album.url = data.url;
					});
				}
			};

			socket.off('album exists').on('album exists', function() {
				$rootScope.$broadcast('alert', 'Альбом с похожим название уже существует!');

				scope.$on('message end', function() {
					element.find('.item-overlay').removeClass('saving');
				});
			});

			socket.off('album updated').on('album updated', function(data) {
				$timeout(function() {
					element.find('.item-overlay').removeClass('saving');
					for ( var i in originalPhotos ) {
						if ( originalPhotos[i]._id == data._id ) {
							originalPhotos[i].title = data.title;
							originalPhotos[i].desc = data.desc;
						}
					}
					scope.$apply();
				}, 500);
			});

			scope.album_publishAlbum = function(e, album) {
				if ( album.published == false ) {
					if ( confirm('Вы уверены, что хотите опубликовать этот альбом?') ) {
						socket.emit('publish album', album.url);
						album.published = !album.published;
						element.find('.item-overlay').addClass('saving');
						$timeout(function() {
							element.find('.item-overlay').removeClass('saving');
						}, 500);
					}
				}
				else {
					if ( confirm('Вы уверены, что хотите отправить этот альбом в черновики?') ) {
						socket.emit('publish album', album.url);
						album.published = !album.published;
						element.find('.item-overlay').addClass('saving');
						$timeout(function() {
							element.find('.item-overlay').removeClass('saving');
						}, 500);
					}
				}
			};

			scope.$on('$locationChangeStart', function(e) {
				if ( scope.albumUpdated || $('.changed', element).length || scope.imgUpdated ) {
					if ( !confirm('Некоторые изменения не были сохранены. Действительно обновить эту страницу?') ) {
						e.preventDefault();
					}
				}
			});
			window.onbeforeunload = function (e) {
				if ( scope.albumUpdated || $('.changed', element).length || scope.imgUpdated ) {
					return 'Некоторые изменения не были сохранены';
				}
			}
		};
	});

})();