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
seanclogApp.config(['$routeProvider', function($routeProvider) {
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
		templateUrl: 'partials/partial-profile.html'
	})
	.when('/test', {
		templateUrl: 'partials/partial-test.html',
		controller: 'TestController'
	})
	.otherwise({
		redirectTo: '/tracks'
	});
}]);

seanclogApp.config()
