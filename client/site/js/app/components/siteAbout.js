(function() {

	var siteAbout = angular.module('siteAbout', []);

	siteAbout.directive('siteAbout', function($http, $location, $rootScope) {
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