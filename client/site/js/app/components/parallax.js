(function() {

	var parallax = angular.module('parallax', []);

	parallax.directive('parallax', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			$('html, body').scrollTop(0);

			scope.nextSlide = function(e) {
				e.preventDefault();

				$rootScope.$emit('nextSlide');

			}
			scope.backToTop = function(e) {
				e.preventDefault();

				$('html, body').animate({scrollTop: 0}, 500);
			}
		};
	});

})();