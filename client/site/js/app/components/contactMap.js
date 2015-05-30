(function() {

	var contactMap = angular.module('contactMap', []);

	contactMap.directive('contactMap', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			scope.marker = {
				position: {
					lat: '49.83968',
					lng: '24.02972'
				},
				info: {
					city: 'Львов',
					phones: ['+38 (099) 111-11-11', '+38 (063) 111-11-11'],
					email: 'email@gmail.com',
					skype: 'skype.name',
					vk: 'vk.address.com'
				}
			}

			var MAPS = {
				render_map: function( $el, $marker ) {
					var self = this;
					var myStyles = [
						{
							featureType: "poi",
							elementType: "labels",
							stylers: [
								{
									visibility: "off"
								}
							]
						},
						{
							featureType: "road",
							elementType: "labels",
							stylers: [
								{
									visibility: "off"
								}
							]
						},
						{
							featureType: "water",
							elementType: "labels",
							stylers: [
								{
									visibility: "off"
								}
							]
						},
						{
							featureType: "transit",
							elementType: "labels",
							stylers: [
								{
									visibility: "off"
								}
							]
						},
						{
							featureType: "all",
							elementType: 'all',
							stylers: [
								{
									saturation: '-100'
								},
								{
									invert_lightness: true
								},
								{
									lightness: '5'
								},
							]
						},
						{
							featureType: "all",
							elementType: 'labels',
							stylers: [
								{
									visibility: 'off'
								}
							]
						}
					];
					self.args = {
						zoom: 12,
						center: new google.maps.LatLng(0, 0),
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						options: {
							mapTypeControl: false,
							streetViewControl: false,
							panControl: false,
							rotateControl: false,
							zoomControl: false,
							scrollwheel: false,
							draggable: false
						},
						styles: myStyles
					};

					var directionDisplay = new google.maps.DirectionsRenderer();
					directionDisplay.set('directions', null);

					var map = new google.maps.Map($el[0], self.args);

					var infowindow = new google.maps.InfoWindow();

			    	this.add_marker($marker, map, infowindow);

				},

				add_marker: function($marker, map, infowindow) {
					var latlng = new google.maps.LatLng($marker.position.lat, $marker.position.lng),
						markerCont = $marker.info,
						self = this,
						marker = new google.maps.Marker({
							position: latlng,
							map: map,
							icon: 'data:image/png;base64,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'
						});

					if ( markerCont ) {
						var infoContent = 	'<h2 class="contact-info-title">' + $marker.info.city + '</h2>' +
											'<dl class="contact-info">' +
												'<dt>тел.</dt>' +
												'<dd>' + $marker.info.phones[0] + '</dd>' +
											'</dl>' +
											'<dl class="contact-info">' +
												'<dt>тел.</dt>' +
												'<dd>' + $marker.info.phones[1] + '</dd>' +
											'</dl>' +
											'<dl class="contact-info">' +
												'<dt>email</dt>' +
												'<dd>' + $marker.info.email + '</dd>' +
											'</dl>' +
											'<dl class="contact-info">' +
												'<dt>skype</dt>' +
												'<dd>' + $marker.info.skype + '</dd>' +
											'</dl>' +
											'<dl class="contact-info">' +
												'<dt>vk</dt>' +
												'<dd>' + $marker.info.vk + '</dd>' +
											'</dl>';

						infowindow.setContent(infoContent);
						infowindow.open(map, marker);
						this.center_map(map, $marker);
						$(window).on('resize', function() {
							self.center_map(map, $marker);
						});
					}
				},

				center_map: function(map, $marker) {
					var bounds = new google.maps.LatLngBounds();
						latlng = new google.maps.LatLng($marker.position.lat, $marker.position.lng);

					bounds.extend(latlng);
				    map.setZoom(this.args.zoom);
					map.setCenter(bounds.getCenter());
				}
			}

			MAPS.render_map(element, scope.marker);
		};
	});

})();