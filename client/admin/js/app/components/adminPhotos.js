(function() {

	var adminPhotos = angular.module('adminPhotos', []);

	adminPhotos.directive('adminPhotos', function($http, $location, $timeout) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			scope.canSave = false;
			scope.hasImage = false;
			scope.canAddTag = false;
			scope.tags = [];
			scope.newTag = '';
			scope.showTags = false;

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

			scope.enterTag = function(e) {
				var tagInput = $(e.target);

				if ( tagInput.val() ) {
					scope.canAddTag = true;
				}
				else {
					scope.canAddTag = false;
				}
			};

			socket.emit('load photos');
			socket.on('photos loaded', function(data) {
				scope.photos = data;
				scope.$apply();
			});
			socket.emit('load tags');
			socket.on('tags loaded', function(data) {
				scope.exTags = data;
			});

			scope.addTag = function(e) {
				e.preventDefault();
				var tag = element.find('#newAlbumTags').val();

				if ( !scope.canAddTag ) {
					return false;
				}

				if ( scope.tags.indexOf(tag) > -1 ) {
					alert('У этого альбома уже есть такой тег');
					element.find('#newAlbumTags').val('').focus();
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

				socket.emit('add album', title.val(), desc.val(), scope.newImage, scope.tags);
				socket.off('album exists').on('album exists', function() {
					alert('Альбом с похожим названием уже существует!');
				});
				socket.off('album added').on('album added', function(url) {
					$location.path($location.path() +  '/' + url);
					$('body').css({overflow: 'visible'});
					scope.$apply();
				});
			};

			scope.removeAlbum = function(e, url, title) {
				e.preventDefault();
				if ( confirm('Вы уверены, что хотите удалить альбом "' + title + '"') ) {
					socket.emit('remove album', url);
					$(e.currentTarget).closest('li').remove();
				}
			};

			scope.triggerUpload = function(e) {
				var item = $(e.target).closest('li'),
					input = item.find('input[type="file"]');

				$timeout(function() {
					input.trigger('click');
				}, 100);
			};

			element.find('input[type="file"]').on('change', function(e) {
				var reader = new FileReader();

				reader.onload = function (e) {
					scope.newImage = e.target.result;
					scope.hasImage = true;
					scope.$apply();
				}

				reader.readAsDataURL($(e.currentTarget)[0].files[0]);
			});
		};
	});

})();