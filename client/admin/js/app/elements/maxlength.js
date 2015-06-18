(function() {

	var maxlength = angular.module('maxlength', []);

	maxlength.directive('maxlength', function($http, $location) {
		return {
			restrict: 'A',
			link: link,
			scope: {
				length: '=maxlength'
			}
		};
		function link(scope, element, attrs) {
			element.after('<span class="max-length">' + scope.length + '</span>');

			var label = element.next('.max-length');

			scope.lengthChanged = function() {
				label.html(scope.length - element.val().length);
			};

			scope.lengthChanged();
			element.on('keyup', function() {
				scope.lengthChanged();
			});
		};
	});

})();