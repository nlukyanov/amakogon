(function() {

	var siteSocial = angular.module('siteSocial', []);

	siteSocial.directive('siteSocial', function($http, $location) {
		return {
			restrict: 'E',
			link: link,
			templateUrl: '../client/site/html/elements/site-social.html'
		};
		function link(scope, element, attrs) {
			if ( $location.$$path == '/' ) {
				element.find('.social-media').addClass('home-social');
			}
		};
	});

})();