(function() {

	var adminBlog = angular.module('adminBlog', []);

	adminBlog.directive('adminBlog', function($http, $location, $timeout, pageTitle, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			scope.isUpdated = false;

			var originalBlog;

			socket.emit('load blog');

			socket.on('blog loaded', function(data) {
				scope.blog = data;
				originalBlog = angular.copy(scope.blog);
				scope.$apply();
			});

			scope.triggerUpload = function(e) {
				$(e.currentTarget).closest('.newAlbum-image').next('input[type="file"]').trigger('click');
			};

			element.find('input[type="file"]').on('change', function(e) {
				scope.showSpinner = true;
				$timeout(function() {
					var reader = new FileReader(),
						image = document.createElement('img'),
						k = 960,
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

			scope.checkIfCanCreate = function() {
				if ( scope.newPostTitle && scope.newPostSynopsis ) {
					scope.canSave = true;
				}
				else {
					scope.canSave = false;
				}
			};

			scope.addPost = function(e) {
				e.preventDefault();
				if ( scope.canSave && scope.hasImage ) {
					$('#blog_info .item-overlay').addClass('saving');
					socket.emit('create post', scope.newPostTitle, scope.newPostSynopsis, scope.newImage);
				}
			};

			socket.on('post exists', function() {
				$rootScope.$broadcast('alert', 'Запись с похожим названием уже существует!');
				$('.item-overlay').removeClass('saving');
			});

			scope.removePost = function(e, url, title, image) {
				e.preventDefault();
				if ( confirm('Вы уверены, что хотите безвозвратно удалить запись "' + title + '"') ) {
					socket.emit('remove post', url, title, image);
					$(e.currentTarget).closest('li').remove();
				}
			};

			socket.off('post added').on('post added', function(url) {
				$location.path($location.path() +  '/' + url);
				$('body').css({overflow: 'visible'});
				scope.$apply();
			});

			scope.post_triggerUpload = function(e, target, post) {
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
							post.thumb = e.target.result;
							scope.imgUpdated = true;
							scope.showSpinner = false;
							scope.$apply();
						}

						reader.readAsDataURL($(e.currentTarget)[0].files[0]);
					}, 0);
				});
			};

			scope.post_checkIfUpdated = function() {
				scope.postUpdated = false;

				for ( var x in originalBlog ) {
					for ( var y in scope.blog ) {
						if ( originalBlog[x]._id == scope.blog[y]._id ) {
							if ( scope.blog[y].title != originalBlog[x].title || scope.blog[y].synopsis != originalBlog[x].synopsis ) {
								scope.postUpdated = true;
							}
						}
					}
				}
			};

			scope.post_updatePost = function(e, post) {
				e.preventDefault();
				var originalTitle = '';

				for ( var i in originalBlog ) {
					if ( originalBlog[i]._id == post._id ) {
						originalTitle = originalBlog[i].title;
					}
				}
				if ( scope.postUpdated || scope.imgUpdated ) {
					scope.postUpdated = false;
					scope.imgUpdated = false;

					socket.emit('update post', post, originalTitle);
					$(e.target).closest('.admin-form').find('.item-overlay').addClass('saving');
				}
			};

			scope.post_publishPost = function(e, post) {
				if ( post.published == false ) {
					if ( confirm('Вы уверены, что хотите опубликовать эту запись?') ) {
						socket.emit('publish post', post.url);
						post.published = !post.published;
						element.find('.item-overlay').addClass('saving');
						$timeout(function() {
							element.find('.item-overlay').removeClass('saving');
						}, 500);
					}
				}
				else {
					if ( confirm('Вы уверены, что хотите отправить эту запись в черновики?') ) {
						socket.emit('publish post', post.url);
						post.published = !post.published;
						element.find('.item-overlay').addClass('saving');
						$timeout(function() {
							element.find('.item-overlay').removeClass('saving');
						}, 500);
					}
				}
			};

			scope.$on('$locationChangeStart', function(e) {
				if ( scope.isUpdated ) {
					if ( !confirm('Некоторые изменения не были сохранены. Действительно обновить эту страницу?') ) {
						e.preventDefault();
					}
				}
			});

			window.onbeforeunload = function (e) {
				if ( scope.isUpdated ) {
					return 'Некоторые изменения не были сохранены.';
				}
			}
		}
	});

})();