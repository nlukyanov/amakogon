(function() {

	var siteBlog = angular.module('siteBlog', []);

	siteBlog.directive('siteBlog', function($http, $location, $rootScope, $timeout) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			$timeout(function() {
				element.addClass('visible');
			}, 0);
		};
	});

})();