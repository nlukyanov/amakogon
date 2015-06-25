(function() {
  
	var router = angular.module('router', ['ngRoute']);

	router.config(function($routeProvider, $locationProvider) {
		$routeProvider
				.when('/admin', {
					templateUrl: config.prefix + 'html/templates/dashboard.html'
				})
				.when('/admin/photos', {
					templateUrl: config.prefix + 'html/templates/photos.html',
					reloadOnSearch: false
				})
				.when('/admin/photos/:id', {
					templateUrl: config.prefix + 'html/templates/album.html',
					reloadOnSearch: false
				})
				.when('/admin/tags', {
					templateUrl: config.prefix + 'html/templates/tags.html'
				})
				.otherwise({redirectTo: '/404'});

		$locationProvider.html5Mode({
			enabled: true,
		});
	});
})();
