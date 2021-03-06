(function() {
  
	var siteItems = {};

	siteItems.main = angular.module('siteItems.main', ['ngRoute', 'router']);

	siteItems.factories = angular.module('siteItems.factories', ['pageTitle']);

	//site.widgets = angular.module('site.widgets', ['widgetItem', 'widgetBtnAlign', 'widgetBtnFontWeight', 'widgetBtnFontSize', 'widgetBtnColor', 'widgetBtnViewHeading', 'widgetBtnWidth', 'widgetBtnHeight', 'widgetBtnViewImage', 'widgetBtnVisibility', 'widgetBtnUpload', 'widgetBtnListSettings', 'widgetBtnAddListItem', 'widgetBtnOverflow', 'widgetBtnBannerSettings', 'widgetBtnPosition', 'widgetBtnBannerHeading', 'widgetBtnBannerText', 'widgetBtnBannerLink', 'widgetBtnLinkType', 'widgetBtnUrl', 'widgetBtnPositionVertical', 'widgetBtnPositionHorisontal', 'widgetBtnFeatureSettings', 'addGridItem']);

	siteItems.elements = angular.module('siteItems.elements', ['siteLogo', 'siteNav', 'siteSocial', 'siteBreadcrumbs', 'backToTop', 'siteSearch', 'modal', 'cropSlider', 'percentage', 'timeline', 'piechart']);

	siteItems.components = angular.module('siteItems.components', ['parallax', 'contactMap', 'sitePhotos', 'errorPage', 'siteAlbum', 'siteBlog', 'sitePost', 'siteAbout', 'siteContact', 'homeItem', 'tagsSearch']);

	var site = angular.module('site', ['siteItems.main', 'siteItems.components', 'siteItems.elements', 'siteItems.factories'/*, 'site.widgets'*/]);
	
	$(window).on('load', function() {
		$('body').addClass('pageLoaded');
		setTimeout(function() {
			$('html, body').scrollTop(0);
		}, 100);
		$('.loader').fadeOut(500);
	});
})();