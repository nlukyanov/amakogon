(function() {

	var dashboardListItem = angular.module('dashboardListItem', []);

	dashboardListItem.directive('dashboardListItem', function($http, $location, $timeout, $rootScope, pageTitle) {
		return {
			restrict: 'A',
			link: link,
			scope: {
				item: '@dashboardListItem'
			},
			templateUrl: '../client/admin/html/components/dashboard-item.html'
		};
		function link(scope, element, attrs) {
			pageTitle.setTitle('Главная');

			var originalTitle = '',
				originalDesc = '',
				originalImg = '';

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

			scope.isUpdated = false;

			scope.changeSlide = function(e, type) {
				scope.isUpdated = scope.slide.title.label != originalTitle || scope.slide.desc != originalDesc || scope.slide.image != originalImg;
			};
			scope.triggerUpload = function(e) {
				var item = $(e.target).closest('.dashboard-list-item'),
					input = item.find('input[type="file"]');

				$timeout(function() {
					input.trigger('click');
				}, 100);
			};
			scope.updateSlide = function() {
				if ( scope.isUpdated ) {
					element.find('.item-overlay').addClass('saving');
					socket.emit('update dashboard', scope.item, scope.slide.image, scope.slide.title.label, scope.slide.desc);
					socket.on('dashboard updated', function(data) {
						if ( data.name === scope.item ) {
							$timeout(function() {
								element.find('.item-overlay').removeClass('saving');
							}, 500);
							originalTitle = data.title.label;
							originalDesc = data.desc;
							originalImg = data.image;

							scope.isUpdated = false;
							scope.$apply();
						}
					});
				}
			};
			element.find('input[type="file"]').on('change', function(e) {
				var reader = new FileReader();

				reader.onload = function (e) {
					scope.slide.image = e.target.result;
					scope.changeSlide();
					scope.$apply();
				}

				reader.readAsDataURL($(e.currentTarget)[0].files[0]);
			});

			scope.$on('$locationChangeStart', function(e) {
				if ( $('.changed').length ) {
					if ( !confirm('Некоторые изменения не были сохранены. Действительно обновить эту страницу?') ) {
						e.preventDefault();
					}
				}
			});
			window.onbeforeunload = function (e) {
				if ( $('.changed').length ) {
					return 'Некоторые изменения не были сохранены';
				}
			}
		};
	});

})();