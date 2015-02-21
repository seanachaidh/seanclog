/**
 * de hoofd angular module
 * auteur: Pieter Van Keymeulen
 */
/*
 * de controller module mot hier nog aan worden toegevoegd
 */
var seanclogApp = angular.module('seanclogApp',
		['ngRoute', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ngAnimate', 'toastr', 'gettext',
		 'SeanclogProjects', 'SeanclogClients', 'SeanclogTracks', 'SeanclogUsers', 'SeanclogProfile']);
/*
 * definieer alle routes
 */
seanclogApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/tracks', {
		templateUrl: 'partials/partial-tracks.html',
		controller: 'TracksController'
	})
	.when('/projects', {
		templateUrl: 'partials/partial-projects.html',
		controller: 'ProjectController'
	})
	.when('/clients', {
		templateUrl: 'partials/partial-clients.html',
		controller: 'ClientController'
	})
	.when('/profile', {
		templateUrl: 'partials/partial-profile.html',
		controller: 'ProfileController'
	})
	.when('/login', {
		templateUrl: 'partials/partial-login.html',
		controller: 'LoginController'
	})
	.otherwise({
		redirectTo: '/login'
	});

}]);

seanclogApp.run(['$cookies', 'gettextCatalog', function($cookies, gettextCatalog) {
	gettextCatalog.setCurrentLanguage($cookies.lang);
}]);

//seanclogApp.config(['$translateProvider', function($translateProvider) {
//	$translateProvider.useStaticFilesLoader({
//		prefix: "/translations/",
//		suffix: ".json"
//	});
//	$translateProvider.preferredLanguage('en');
//}]);
