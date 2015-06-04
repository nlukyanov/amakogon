(function() {

	var sitePost = angular.module('sitePost', []);

	sitePost.directive('sitePost', function($http, $location, $rootScope) {
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