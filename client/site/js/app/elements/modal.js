(function() {

	var modal = angular.module('modal', []);

	modal.directive('modal', function($http, $location) {
		return {
			restrict: 'A',
			link: link
		};
		function link(scope, element, attrs) {
			var popup = $('#' + element.data('target')),
				closeBtn = popup.find('.modal-close');

			popup.on('click', function(e) {
				if ( !$(e.target).hasClass('modal-box') && !$(e.target).closest('.modal-box').length ) {
					scope.closeModal(e);
				}
			});
			$('.modal-close').on('click', function(e) {
				e.preventDefault();
				scope.closeModal(e);
			});

			scope.openModal = function(e) {
				e.preventDefault();

				popup.addClass('isAnimated').addClass('visible');
				$('html, body').css({overflow: 'hidden'});
			};
			scope.closeModal = function(e) {
				e.preventDefault();

				popup.removeClass('isAnimated').removeClass('visible');
				$('html, body').css({overflow: 'visible'});
			};
		};
	});

})();