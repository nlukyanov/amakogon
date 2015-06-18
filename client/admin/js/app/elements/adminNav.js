(function() {

	var adminNav = angular.module('adminNav', []);

	adminNav.directive('adminNav', function($http, $location) {
		return {
			restrict: 'E',
			link: link,
			templateUrl: '../client/admin/html/elements/admin-nav.html'
		};
		function link(scope, element, attrs) {
			if ( $location.$$path == '/admin' ) {
				scope.path = 'dashboard';
			}
			else if ( $location.$$path == '/admin/photos' ) {
				scope.path = 'photos';
			}
			else if ( $location.$$path == '/admin/tags' ) {
				scope.path = 'tags';
			}
			else if ( $location.$$path == '/admin/blog' ) {
				scope.path = 'blog';
			}
			else if ( $location.$$path == '/admin/about' ) {
				scope.path = 'about';
			}
			else if ( $location.$$path == '/admin/contact' ) {
				scope.path = 'contact';
			}
		};
	});

})();