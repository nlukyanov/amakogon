(function() {
  
	var router = angular.module('router', ['ngRoute']);

	router.config(function($routeProvider, $locationProvider) {
		$routeProvider
				.when('/', {
					templateUrl: config.prefix + 'html/templates/homepage.html',
				})
				.otherwise({redirectTo: '/404'});
		//$locationProvider.html5Mode(true);
	});

})();
