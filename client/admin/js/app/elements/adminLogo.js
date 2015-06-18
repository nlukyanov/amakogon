(function() {

	var adminLogo = angular.module('adminLogo', []);

	adminLogo.directive('adminLogo', function($http, $location) {
		return {
			restrict: 'E',
			link: link,
			templateUrl: '../client/admin/html/elements/admin-logo.html'
		};
		function link(scope, element, attrs) {

		};
	});

})();