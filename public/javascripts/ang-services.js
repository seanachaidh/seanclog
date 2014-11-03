/*
 * in dit bestand zitten de "diensten" van mijn project
 */

var clogService = angular.module('seanClogServices', ['ngResource']);
clogService.factory('Projects', ['$resource', function($resource) {
	var fact = $resource('/api/projects',{},
			{'query': {method:'GET', isArray: true},
			 'post': {method: 'POST', params: {}}
			});
	return fact;
}]);

clogService.factory('Tests', ['$resource', function ($resource) {
	var fact = $resource('/api/posttest', {}, {'testuser': {method: 'POST'}});
	return fact;
}]);

/*
 * ik moet deze functie nog testen.
 * Ik moet ervoor zorgen dat ik hier de angular resource gebruik in plaats van
 * de 'verouderde' http service
 */
clogService.factory('Session', ['$resource', function($resource) {
	var fact = $resource('/api/:varname');
}]);

clogService.factory('Tracks', ['$resource', function($resource) {
	var fact = $resource('/api/tracks', {}, {'query': {method:'GET', isArray: true}});
	return fact;
}]);

clogService.factory('Klanten', ['$resource', function($resource) {
	var fact = $resource('/api/clients', {}, {'query': {method: 'GET', isArray: true}});
	return fact;
}]);
