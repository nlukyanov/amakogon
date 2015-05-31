(function() {

	var siteTags = angular.module('siteTags', []);

	siteTags.directive('siteTags', function($http, $location) {
		return {
			restrict: 'C',
			link: link,
			templateUrl: '../client/site/html/elements/site-tags.html'
		};
		function link(scope, element, attrs) {

		};
	});

})();