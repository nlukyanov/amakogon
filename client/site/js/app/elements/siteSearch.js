(function() {

	var siteSearch = angular.module('siteSearch', []);

	siteSearch.directive('siteSearch', function($http, $location) {
		return {
			restrict: 'E',
			link: link,
			templateUrl: '../client/site/html/elements/site-search.html'
		};
		function link(scope, element, attrs) {
			if ( $location.$$path == '/' ) {
				element.find('.search-block').addClass('home-search');
			}

			scope.toggleSearch = function(e) {
				e.preventDefault();

				if ( !$('.search-input.visible input').val() ) {
					$('.search-input').toggleClass('visible');
					setTimeout(function() {
						$('.search-input.visible input').trigger('focus');
					}, 250);
				}
				else {
					searchTag();
				}
			}

			scope.submitSearch = function() {
				if ( $('.search-input.visible input').val() ) {
					searchTag();
				}
			}

			function searchTag() {
				var path = '/tags#' + $('.search-input.visible input').val();
				$location.url(path);
			}
		};
	});

})();