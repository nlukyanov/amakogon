(function() {

	var siteNav = angular.module('siteNav', []);

	siteNav.directive('siteNav', function($http, $location) {
		return {
			restrict: 'E',
			link: link,
			templateUrl: '../client/site/html/elements/site-nav.html'
		};
		function link(scope, element, attrs) {
			if ( $location.$$path == '/' ) {
				scope.index = 1;
				element.find('nav').addClass('home-nav');
				$(window).on('scroll', function() {
					scope.$apply(function() {
						if ( $(window).width() > 1024 ) {
							scope.index = Math.floor($(window).scrollTop() / $(window).height() + .05) + 1;
							scope.$emit('pxScroll', scope.index);
						}
					});
				});
			}
			
			scope.scrollTo = function(e, index) {
				if ( element.find('nav').hasClass('home-nav') && $(window).width() > 1024 ) {
					e.preventDefault();

					var scrollTo = $(window).height() * (index - 1);

					$('html, body').animate({scrollTop: scrollTo}, 500);
				}
			};
			scope.$on('nextSlide', function() {
				$('html, body').animate({scrollTop: $(window).height() * scope.index}, 500);
			});

			scope.toggleNav = function(e) {
				e.preventDefault();

				element.find('.site-nav').toggleClass('active');
			}

			if ( $location.$$path == '/' ) {
				scope.path = 'home';
			}
			else if ( $location.$$path == '/photos' ) {
				scope.path = 'photos';
			}
			else if ( $location.$$path == '/blog' ) {
				scope.path = 'blog';
			}
			else if ( $location.$$path == '/about' ) {
				scope.path = 'about';
			}
			else if ( $location.$$path == '/contact' ) {
				scope.path = 'contact';
			}
		};
	});

})();