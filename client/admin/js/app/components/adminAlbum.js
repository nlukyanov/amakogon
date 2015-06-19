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
				originalDesc = '';

			scope.newTag = '';
			scope.showTags = false;
			scope.newPhotos = [];

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
				scope.$apply();
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

			scope.removeAlbum = function(e, url, title) {
				e.preventDefault();
				if ( confirm('Вы уверены, что хотите удалить альбом "' + title + '"') ) {
					socket.emit('remove album', url);
					$location.path('/admin/photos');
					scope.$apply();
				}
			};

			scope.triggerPhotosUpload = function(e) {
				e.preventDefault();

				var photosInput = element.find('#newPhotos');

				photosInput.trigger('click');
			}
			element.find('#newPhotos').on('change', function(e) {
				var files = $(e.currentTarget)[0].files;

				for ( var i = 0; i < files.length; i ++ ) {
					var reader = new FileReader();

					reader.onload = function (e) {
						var duplicate = false;
						for ( var x = 0; x < scope.newPhotos.length; x ++ ) {
							if ( scope.newPhotos[x] == e.target.result ) {
								duplicate = true;
							}
						}
						if ( !duplicate ) {
							scope.newPhotos.push({'image': e.target.result, 'title': '', 'desc': '', 'parent': scope.album.title});
							scope.$apply();
						}
					}

					reader.readAsDataURL(files[i]);
				}
			});
		};
	});

})();