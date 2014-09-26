/**
 * de hoofd angular module
 * auteur: Pieter Van Keymeulen
 */
/*
 * de controller module mot hier nog aan worden toegevoegd
 */
var seanclogApp = angular.module('seanclogApp', ['ngRoute']);

/*
 * definieer alle routes
 */
seanclogApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/tracks', {
		templateUrl: 'partials/partial-tracks.html'
	})
	.when('/projects', {
		templateUrl: 'partials/partial-projects.html'
	})
	.otherwise({
		redirectTo: '/tracks'
	});
}]);
