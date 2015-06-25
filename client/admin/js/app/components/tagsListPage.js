(function() {

	var tagsListPage = angular.module('tagsListPage', []);

	tagsListPage.directive('tagsListPage', function($http, $location, $timeout, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			socket.emit('load tags');
			socket.off('tags loaded').on('tags loaded', function(data) {
				scope.tags = data;
				scope.types = [];

				var index = 0;

				if ( scope.tags.length ) {
					createTags(scope.tags.length);
				}

				function createTags(length) {
					if ( index < length ) {
						var value = scope.tags[index].tag.substr(0, 1);

						if ( !isNaN(parseInt(value)) ) {
							scope.tags[index].type = '0-9';

							if ( scope.types.indexOf('0-9') == -1 ) {
								scope.types.push('0-9');
							}
						}
						else {
							value = value.toUpperCase();
							scope.tags[index].type = value;

							if ( scope.types.indexOf(value) == -1 ) {
								scope.types.push(value);
							}
						}

						socket.emit('check tags', scope.tags[index].tag);
						socket.off('tags checked').on('tags checked', function(albumDisabled, photoDisabled) {
							if ( scope.tags[index] ) {
								scope.tags[index].disabled = albumDisabled && photoDisabled;
								index ++;
								createTags(length);
							}
						});
					}
					if ( index == length ) {
						$('.item-overlay').removeClass('saving');
						scope.$apply();
					}
				}

				scope.tagEdited = false;

				scope.editTag = function(e) {
					e.preventDefault();

					$(e.currentTarget).closest('.tags-list-item').toggleClass('tagVisible');
				};

				scope.searchTag = function(e, tag) {
					e.preventDefault();
					scope.currentTag = tag.tag;
					socket.emit('load albums by tag', scope.currentTag);
					socket.off('albums by tag loaded').on('albums by tag loaded', function(data) {
						scope.albums = data;
						socket.emit('load photos by tag', scope.currentTag);
						socket.off('photos by tag loaded').on('photos by tag loaded', function(data) {
							scope.photos = data;
							$(e.currentTarget).closest('.tags-list-item').toggleClass('tagVisible');
							$('.modal').attr('id', tag._id);
							$('.tag-modal-heading').html(scope.currentTag);
							$(e.currentTarget).closest('.tags-list-item').find('.tag-modal-link').trigger('click');
							scope.triggerRemove = function(e) {
								scope.removeTag(e, scope.currentTag);
							}
							scope.$apply();
						});
					});
				};

				scope.removeTag = function(e, tag) {
					e.preventDefault();

					if ( confirm('Вы уверены, что хотите безвозвратно удалить этот тег?') ) {
						socket.emit('remove tag', tag);
						$('.item-overlay').addClass('saving');
						$('.tagVisible').removeClass('tagVisible');
						$timeout(function() {
							$('.modal-close').trigger('click');
						}, 0);
					}
				};

				scope.closeModal = function(e) {
					e.preventDefault();
					$('.modal').removeClass('isAnimated').removeClass('visible');
					$('body').removeClass('isModal');
				};

				scope.tagsInput = '';
				scope.$watch('tagsInput', function() {
					$timeout(function() {
						var links = $('.tag-link'),
							compare = scope.tagsInput.toLowerCase();

						if ( links.length ) {
							$('.tags-message').hide();
							for ( var i = 0; i < links.length; i ++ ) {
								var item = $(links[i]),
									text = item.html().toLowerCase().replace('<font>', '').replace('</font>', ''),
									originalText = item.html().replace('<font>', '').replace('</font>', '');

								if ( text.indexOf(compare) != -1 ) {
									var textStart = originalText.substr(0, text.indexOf(compare)),
										textMiddle = '<font>' + originalText.substr(text.indexOf(compare), compare.length) + '</font>',
										textEnd = originalText.substr(text.indexOf(compare) + compare.length, text.length);

									item.html(textStart + textMiddle + textEnd);
								}

								if ( i == links.length - 1 ) {
									$timeout(function() {
										$('.tags-list').each(function() {
											if ( $(this).children().length ) {
												$(this).closest('.tags-col').show();
											}
											else {
												$(this).closest('.tags-col').hide();
											}
										});
									}, 0);
								}
							}
						}
						else {
							$('.tags-col').hide();
							$('.tags-message').show();
						}
					}, 0);
				});
			});
			scope.addTag = function(e) {
				e.preventDefault();

				for ( var i in scope.tags ) {
					if ( scope.tags[i].tag == $('#tagInput').val() ) {
						alert('Такой тег уже существует!');
						return false;
					}
				}
				socket.emit('add tag', [$('#tagInput').val()]);
				scope.tagsInput = '';
				scope.tags.push({'tag': $('#tagInput').val()});

				scope.types = [];

				var index = 0;

				createTags(scope.tags.length);

				function createTags(length) {
					if ( index < length ) {
						var value = scope.tags[index].tag.substr(0, 1);

						if ( !isNaN(parseInt(value)) ) {
							scope.tags[index].type = '0-9';

							if ( scope.types.indexOf('0-9') == -1 ) {
								scope.types.push('0-9');
							}
						}
						else {
							value = value.toUpperCase();
							scope.tags[index].type = value;

							if ( scope.types.indexOf(value) == -1 ) {
								scope.types.push(value);
							}
						}

						socket.emit('check tags', scope.tags[index].tag);
						socket.off('tags checked').on('tags checked', function(albumDisabled, photoDisabled) {
							scope.tags[index].disabled = albumDisabled && photoDisabled;
							index ++;
							createTags(length);
						});
					}
					if ( index == length ) {
						$('.item-overlay').removeClass('saving');
						scope.$apply();
					}
				}
			}
		};
	});

})();