(function() {

	var tagsList = angular.module('tagsList', []);

	tagsList.directive('tagsList', function($http, $location, $timeout) {
		return {
			restrict: 'A',
			link: link,
			templateUrl: '../client/admin/html/elements/tags-list.html',
			scope: {
				tags: '=tagsList',
				changed: '=tagsListChanged'
			}
		};
		function link(scope, element, attrs) {
			scope.$watch('tags', function() {
				if ( scope.tags ) {
					scope.originalTags = angular.copy(scope.tags);
				}
			});

			socket.emit('load tags');
			socket.on('tags loaded', function(data) {
				scope.exTags = data;
			});

			scope.exTagIndex = -1;

			scope.moveToExTags = function(e) {
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
				}
			};

			scope.addTag = function(tag) {
				scope.exTagIndex = -1;
				scope.tagExists = false;

				for ( var i in scope.tags ) {
					if ( scope.tags[i] == tag ) {
						scope.tagExists = true;
					}
				}
				if ( scope.tagExists ) {
					$timeout(function() {
						alert('Такой тег уже есть!');
						return false;
					}, 0);
				}
				else {
					scope.tags.push(tag);
				}
				scope.newTag = '';
				scope.changed = !angular.equals(scope.tags, scope.originalTags);
				scope.$emit('tags changed');
			};

			scope.removeTag = function(tag) {
				var index = scope.tags.indexOf(tag);

				scope.tags.splice(index, 1);
				scope.changed = !angular.equals(scope.tags, scope.originalTags);
				scope.$emit('tags changed');
			}
		};
	});

})();