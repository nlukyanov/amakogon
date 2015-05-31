(function() {
  
	var router = angular.module('router', ['ngRoute']);

	router.config(function($routeProvider, $locationProvider) {
		$routeProvider
				.when('/', {
					templateUrl: config.prefix + 'html/templates/homepage.html'
				})
				.when('/photos', {
					templateUrl: config.prefix + 'html/templates/photos.html'
				})
				.when('/photos/:id', {
					templateUrl: config.prefix + 'html/templates/photos.html'
				})
				.when('/photos/:id/:id', {
					templateUrl: config.prefix + 'html/templates/photos.html'
				})
				.when('/photos/:id/:id#fullsize', {
					templateUrl: config.prefix + 'html/templates/photos.html'
				})
				.otherwise({redirectTo: '/404'});

		$locationProvider.html5Mode({
			enabled: true,
		});
	});

})();
