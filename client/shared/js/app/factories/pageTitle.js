(function() {

	var pageTitle = angular.module('pageTitle', []);

	pageTitle.factory('pageTitle', function() {
		var title = 'default';

		return {
			title: function() {
				return title;
			},
			setTitle: function(newTitle) {
				title = newTitle;
				$('title').html('Anastasia Makogon | ' + title);
			}
		};
	});

})();