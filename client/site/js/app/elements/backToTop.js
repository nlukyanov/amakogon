(function() {

	var backToTop = angular.module('backToTop', []);

	backToTop.directive('backToTop', function($http, $location) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			scope.backToTop = function(e) {
				e.preventDefault();

				$('html, body').animate({scrollTop: 0}, 500);
			}
		};
	});

})();