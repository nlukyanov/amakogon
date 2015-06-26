(function() {

	var message = angular.module('message', []);

	message.directive('message', function($http, $location, $timeout, $rootScope) {
		return {
			restrict: 'C',
			link: link,
			templateUrl: '../client/admin/html/elements/message.html'
		};
		function link(scope, element, attrs) {
			scope.messageText = element.find('.message-text');
			
			scope.$on('alert', function(e, alert) {
				scope.showMessage(alert);
				element.addClass('alert');
				$('body').addClass('isMessage');

				scope.timeout = $timeout(function() {
					scope.hideMessage();
				}, 5000);
			});

			scope.$on('success', function(success) {
				scope.showMessage(success);
				element.addClass('success');

				scope.timeout = $timeout(function() {
					scope.hideMessage();
				}, 5000);
			});

			scope.showMessage = function(message) {
				scope.messageText.html(message);
				element.addClass('visible');
			};

			scope.hideMessage = function() {
				scope.messageText.html('');
				element.removeClass('visible').removeClass('alert').removeClass('success');
				$('body').removeClass('isMessage');
				$rootScope.$broadcast('message end');
				$timeout.cancel(scope.timeout);
				return false;
			};
		}
	});

})();