(function() {

	var sitePhoto = angular.module('sitePhoto', []);

	sitePhoto.directive('sitePhoto', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			setTimeout(function() {
				$('.site-photo').addClass('visible');
			}, 0);
		};
	});

})();