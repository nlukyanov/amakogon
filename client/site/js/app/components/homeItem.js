(function() {

	var homeItem = angular.module('homeItem', []);

	homeItem.directive('homeItem', function($http, $location, $rootScope) {
		return {
			restrict: 'A',
			link: link,
			scope: {
				item: '@homeItem'
			},
			templateUrl: '../client/site/html/components/home-item.html'
		};
		function link(scope, element, attrs) {
			var socket = io.connect();

			socket.emit('load dashboard', scope.item);
			socket.on('dashboard loaded', function(data) {
				if ( data.name === scope.item ) {
					originalTitle = data.title.label;
					originalDesc = data.desc;
					originalImg = data.image;

					scope.slide = data;
					scope.$apply();
				}
			});
		};
	});

})();