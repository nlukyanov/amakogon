(function() {

	var adminPost = angular.module('adminPost', []);

	adminPost.directive('adminPost', function($http, $location, $timeout, pageTitle, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			var url = $location.path().substr($location.path().indexOf('/admin/blog/') + 12, $location.path().length),
				originalPost;

			scope.showNewContent = false;
			scope.showAlbumSpinner = false;

			socket.emit('load post', url);

			socket.off('post loaded').on('post loaded', function(data) {
				scope.post = data;
				originalPost = angular.copy(scope.post);
				scope.$apply();
			});

			scope.triggerUpload = function(e) {
				var input = $(e.currentTarget).next('input[type="file"]');

				$timeout(function() {
					input.trigger('click');
				}, 100);
			};

			element.find('#newPostPhoto').on('change', function(e) {
				scope.imgUpdated = true;
				scope.showAlbumSpinner = true;
				$timeout(function() {
					var reader = new FileReader();

					reader.onload = function (e) {
						scope.post.thumb = e.target.result;
						scope.showAlbumSpinner = false;
						scope.$apply();
					};

					reader.readAsDataURL($(e.currentTarget)[0].files[0]);
				}, 100);
			});

			scope.removePost = function(e, url, title, image) {
				e.preventDefault();
				if ( confirm('Вы уверены, что хотите безвозвратно удалить запись "' + title + '"') ) {
					socket.emit('remove post', url, title, image);
					$location.path('/admin/blog');
				}
			};

			scope.updatePost = function(e, post) {
				e.preventDefault();
				var originalTitle = '';

				originalTitle = originalPost.title;

				if ( scope.postUpdated || scope.imgUpdated ) {
					scope.postUpdated = false;
					scope.imgUpdated = false;

					socket.emit('update post', post, originalTitle);
					$(e.target).closest('.admin-form').find('.item-overlay').addClass('saving');
				}
			};

			socket.off('post updated').on('post updated', function(data) {
				if ( originalPost.url != data[0].url ) {
					$location.path('/admin/blog/' + data[0].url);
					$timeout(function() {
						scope.$apply();
					}, 0);
				}
				else {
					$timeout(function() {
						$('.item-overlay').removeClass('saving');
						originalPost = angular.copy(scope.post);
						scope.$apply();
					}, 500);
				}
			});

			scope.checkIfUpdated = function() {
				scope.postUpdated = false;

				if ( originalPost._id == scope.post._id ) {
					if ( scope.post.title != originalPost.title || scope.post.synopsis != originalPost.synopsis ) {
						scope.postUpdated = true;
					}
				}
			};

			scope.publishPost = function(e, post) {
				if ( post.published == false ) {
					if ( confirm('Вы уверены, что хотите опубликовать эту запись?') ) {
						socket.emit('publish post', post.url);
						post.published = !post.published;
						element.find('.post-info .item-overlay').addClass('saving');
						$timeout(function() {
							element.find('.post-info .item-overlay').removeClass('saving');
						}, 500);
					}
				}
				else {
					if ( confirm('Вы уверены, что хотите отправить эту запись в черновики?') ) {
						socket.emit('publish post', post.url);
						post.published = !post.published;
						element.find('.post-info .item-overlay').addClass('saving');
						$timeout(function() {
							element.find('.post-info .item-overlay').removeClass('saving');
						}, 500);
					}
				}
			};

			scope.newContent = function(e) {
				e.preventDefault();

				scope.showNewContent = !scope.showNewContent;
			};
		}
	});

})();