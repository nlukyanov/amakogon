(function() {

	var siteAlbum = angular.module('siteAlbum', []);

	siteAlbum.directive('siteAlbum', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			var slider = element.find('.album-slider');

			setTimeout(function() {
				slider.find('.album-slider-item').addClass('visible');
			}, 0);

			slider.flexslider({
				animation: 'slide',
				slideshow: false,
				controlNav: false
			});

			scope.goToImage = function(path) {
				$location.url(path);
			}
		};
	});

})();