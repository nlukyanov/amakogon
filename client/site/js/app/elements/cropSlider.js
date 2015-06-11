(function() {

	var cropSlider = angular.module('cropSlider', []);

	cropSlider.directive('cropSlider', function($http, $location) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			var slider = element.find('.crop-slider-list'),
				items = slider.find('.crop-slider-item');

			scope.openSlider = function(e) {
				var item = $(e.currentTarget);
				item.css({flex: 100 - 100 / items.length * 2 + '%'}).siblings().addClass('blur');
			}
			scope.closeSlider = function(e) {
				var item = $(e.currentTarget);

				item.css({flex: 1}).siblings().removeClass('blur');
			}
		};
	});

})();