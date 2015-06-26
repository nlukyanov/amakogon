(function() {

	var siteBreadcrumbs = angular.module('siteBreadcrumbs', []);

	siteBreadcrumbs.directive('siteBreadcrumbs', function($http, $location, $timeout) {
		return {
			restrict: 'E',
			link: link,
			templateUrl: '../client/site/html/elements/site-breadcrumbs.html'
		};
		function link(scope, element, attrs) {
			scope.$on('create breadcrumbs', function(e, data) {
				scope.breadcrumbs = [
					{
						title: 'Главная',
						url: '/'
					}
				];
				for ( var i in data ) {
					scope.breadcrumbs.push(data[i]);
					$timeout(function() {
						scope.$apply();
					}, 0);
				}
			});
		};
	});

})();