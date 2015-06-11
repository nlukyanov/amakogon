(function() {

	var piechart = angular.module('piechart', []);

	piechart.directive('piechart', function($http, $location) {
		return {
			restrict: 'A',
			link: link,
			scope: {
				lang: '=piechart'
			}
		};
		function link(scope, element, attrs) {
			scope.data = {
				'label': 'Украинский',
				'type': 'ua',
				'exp': '80',
				'expLabel': 'Родной'
			}

			element.append('<span class="piechart-label">' + scope.data.expLabel + '</span><div class="piechart-inner"><div class="piechart-data-holder"><div class="piechart-data-back"><div class="piechart-data-inner"></div></div><div class="piechart-data"><div class="piechart-data-inner"></div></div><div class="piechart-mask"></div></div><div class="piechart-icon flag-' + scope.data.type + '" style="background-image: url(../client/shared/images/flags/' + scope.data.type + '.svg)"></div></div>');

			var chartBack = element.find('.piechart-data-back'),
				chart = element.find('.piechart-data'),
				percent = 180 - (scope.data.exp - 50) * 2 * 180 / 100,
				mask = element.find('.piechart-mask');

			if ( scope.data.exp >= 50 ) {
				element.removeClass('inverted');
				mask.css({'-webkit-transform': 'rotate(' + percent + 'deg) translateZ(0)', 'transform': 'rotate(' + percent + 'deg) translateZ(0)'});
			}
			else {
				element.addClass('inverted');
				mask.css({'-webkit-transform': 'rotate(' + (180 + percent) + 'deg) translateZ(0)', 'transform': 'rotate(' + (180 + percent) + 'deg) translateZ(0)'});
			}
			chart.css({'-webkit-transform': 'rotate(' + percent + 'deg) translateZ(0)', 'transform': 'rotate(' + percent + 'deg) translateZ(0)'});
		};
	});

})();