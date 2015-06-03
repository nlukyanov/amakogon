(function() {
  
	var siteItems = {};

	siteItems.main = angular.module('siteItems.main', ['ngRoute', 'router']);

	//site.factories = angular.module('site.factories', ['stSettingsFactory', 'stIconsFactory', 'stAdminNavFactory', 'stPagesListFactory', 'stContentTypeFactory']);

	//site.widgets = angular.module('site.widgets', ['widgetItem', 'widgetBtnAlign', 'widgetBtnFontWeight', 'widgetBtnFontSize', 'widgetBtnColor', 'widgetBtnViewHeading', 'widgetBtnWidth', 'widgetBtnHeight', 'widgetBtnViewImage', 'widgetBtnVisibility', 'widgetBtnUpload', 'widgetBtnListSettings', 'widgetBtnAddListItem', 'widgetBtnOverflow', 'widgetBtnBannerSettings', 'widgetBtnPosition', 'widgetBtnBannerHeading', 'widgetBtnBannerText', 'widgetBtnBannerLink', 'widgetBtnLinkType', 'widgetBtnUrl', 'widgetBtnPositionVertical', 'widgetBtnPositionHorisontal', 'widgetBtnFeatureSettings', 'addGridItem']);

	siteItems.elements = angular.module('siteItems.elements', ['siteLogo', 'siteNav', 'siteSocial', 'siteBreadcrumbs', 'backToTop', 'siteTags', 'siteSearch']);

	siteItems.components = angular.module('siteItems.components', ['parallax', 'contactMap', 'sitePhotos', 'errorPage', 'siteAlbum']);

	var site = angular.module('site', ['siteItems.main', 'siteItems.components', 'siteItems.elements'/*, 'site.factories', 'site.widgets'*/]);
	
	$(window).on('load', function() {
		$('body').addClass('pageLoaded');
		setTimeout(function() {
			$('html, body').scrollTop(0);
		}, 100);
		$('.loader').fadeOut(500);
	});
})();