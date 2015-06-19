(function() {
  
	var router = angular.module('router', ['ngRoute']);

	router.config(function($routeProvider, $locationProvider) {
		$routeProvider
				.when('/admin', {
					templateUrl: config.prefix + 'html/templates/dashboard.html'
				})
				.when('/admin/photos', {
					templateUrl: config.prefix + 'html/templates/photos.html'
				})
				.when('/admin/photos/:id', {
					templateUrl: config.prefix + 'html/templates/album.html'
				})
				.otherwise({redirectTo: '/404'});

		$locationProvider.html5Mode({
			enabled: true,
		});
	});
})();
