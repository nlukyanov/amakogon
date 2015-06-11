(function() {

	var percentage = angular.module('percentage', []);

	percentage.directive('percentage', function($http, $location) {
		return {
			restrict: 'A',
			link: link
		};
		function link(scope, element, attrs) {
			element.find('.percentage').width(element.find('.percentage-label').text());
		};
	});

})();