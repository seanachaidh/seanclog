/**
 * de hoofd angular module
 * auteur: Pieter Van Keymeulen
 */
/*
 * de controller module mot hier nog aan worden toegevoegd
 */
var seanclogApp = angular.module('seanclogApp',
		['seanClogServices', 'seanClogControllers', 'ngRoute', 'ui.grid',
		 'pascalprecht.translate']);
/*
 * definieer alle routes
 */
seanclogApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/tracks', {
		templateUrl: 'partials/partial-table.html',
		controller: 'TracksController'
	})
	.when('/projects', {
		templateUrl: 'partials/partial-table.html',
		controller: 'ProjectController'
	})
	.when('/clients', {
		templateUrl: 'partials/partial-table.html',
		controller: 'KlantenController'
	})
	.when('/profile', {
		templateUrl: 'partials/partial-profile.html',
		controller: 'ProfileController'
	})
	.when('/test', {
		templateUrl: 'partials/partial-test.html',
		controller: 'TestController'
	})
	.when('/login', {
		templateUrl: 'partials/partial-login.html',
	}
	.otherwise({
		redirectTo: '/login'
	});

	
}]);
//seanclogApp.config(['$translateProvider', function($translateProvider) {
//	$translateProvider.useStaticFilesLoader({
//		prefix: "/translations/",
//		suffix: ".json"
//	});
//	$translateProvider.preferredLanguage('en');
//}]);
