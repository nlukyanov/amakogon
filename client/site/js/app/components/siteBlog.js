(function() {

	var siteBlog = angular.module('siteBlog', []);

	siteBlog.directive('siteBlog', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			setTimeout(function() {
				element.addClass('visible');
			}, 0);
		};
	});

})();