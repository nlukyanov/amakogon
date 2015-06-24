(function() {

	var tagsSearch = angular.module('tagsSearch', []);

	tagsSearch.directive('tagsSearch', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			scope.tag = decodeURIComponent($location.hash());

			socket.emit('load albums by tag', scope.tag);
			socket.on('albums by tag loaded', function(data) {
				scope.albums = data;
				socket.emit('load photos by tag', scope.tag);
				socket.on('photos by tag loaded', function(data) {
					scope.photos = data;
					scope.$apply();
				});
			});
		};
	});

})();