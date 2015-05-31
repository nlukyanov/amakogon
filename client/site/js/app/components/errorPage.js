(function() {

	var errorPage = angular.module('errorPage', []);

	errorPage.directive('errorPage', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			function moveBg(e) {
				if ( $(window).width() > 1024 ) {
					var x = e.clientX,
						y = e.clientY;

					element.css({backgroundPosition: ($(window).width() / 2 - x) / 5 + 'px ' + ($(window).height() / 2 - y) / 5 + 'px'});
				}
			}
			$(window).on('load'), function(e) {
					moveBg(e);
			}
			$(window).on('resize', function() {
				element.css({backgroundPosition: '50% 50%'});
				moveBg();
			});
			$('body').on('mousemove', function(e) {
				moveBg(e);
			});
		};
	});

})();