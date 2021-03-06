(function() {

	var modal = angular.module('modal', []);

	modal.directive('modal', function($http, $location, $timeout, $rootScope) {
		return {
			restrict: 'A',
			link: link
		};
		function link(scope, element, attrs) {
			scope.openModal = function(e) {
				e.preventDefault();
				scope.popup = $('#' + attrs.target);
				scope.closeBtn = scope.popup.find('.modal-close');

				scope.popup.addClass('isAnimated').addClass('visible');
				$('body').addClass('isModal');
				scope.popup.find('input[type="text"]').first().trigger('focus');
				$rootScope.$broadcast('modal open', attrs.target);
			};

			scope.closeModal = function(e) {
				e.preventDefault();

				$rootScope.$broadcast('modal closed');
				$timeout(function() {
					$('.modal').removeClass('isAnimated').removeClass('visible');
					$('body').removeClass('isModal');
				}, 0);
			};

			scope.prevModal = function(e, target, popup) {
				e.preventDefault();

				var currentPopup = $('#' + popup),
					prevPopup = $('#' + target);

				prevPopup.addClass('moveLeft').addClass('visible');

				$timeout(function() {
					prevPopup.addClass('isAnimated').removeClass('moveLeft');
					currentPopup.addClass('moveRight');
				}, 10);

				$timeout(function() {
					currentPopup.removeClass('moveRight').removeClass('visible').removeClass('isAnimated');
					$rootScope.$broadcast('modal prev', target);
				}, 500);
			}
			scope.nextModal = function(e, target, popup) {
				e.preventDefault();
				var currentPopup = $('#' + popup),
					nextPopup = $('#' + target);

				nextPopup.addClass('moveRight').addClass('visible');

				$timeout(function() {
					nextPopup.addClass('isAnimated').removeClass('moveRight');
					currentPopup.addClass('moveLeft');
				}, 10);

				$timeout(function() {
					currentPopup.removeClass('moveLeft').removeClass('visible').removeClass('isAnimated');
					$rootScope.$broadcast('modal next', target);
				}, 500);
			}
		}
	});

})();