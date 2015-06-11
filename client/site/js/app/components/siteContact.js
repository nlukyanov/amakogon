(function() {

	var siteContact = angular.module('siteContact', []);

	siteContact.directive('siteContact', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			
		}
	});

})();