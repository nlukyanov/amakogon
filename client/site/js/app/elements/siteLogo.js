(function() {

	var siteLogo = angular.module('siteLogo', []);

	siteLogo.directive('siteLogo', function($http, $location) {
		return {
			restrict: 'E',
			link: link,
			templateUrl: '../client/site/html/elements/site-logo.html'
		};
		function link(scope, element, attrs) {
			var logo = element.find('.logo');

			if ( $location.$$path == '/' ) {
				logo.addClass('home-logo').closest('header').addClass('home-header');

				var logoTop = logo.position().top;

				$(window).on('scroll', function() {
					if ( $(window).width() > 1024 ) {
						var scrollTop = $(window).scrollTop();

						logo.css({top: logoTop - scrollTop / 2});

						if ( logo.position().top <= 20 + logo.height() / 2 ) {
							logo.css({top: 20 + logo.height() / 2});
						}
					}
				});
			}

			scope.$on('$routeChangeStart', function(next, current) {
				$('html, body').scrollTop(0);
			});
		};
	});

})();