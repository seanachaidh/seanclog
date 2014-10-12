/*
 * in dit bestand zitten de "diensten" van mijn project
 */

var clogService = angular.module('seanClogServices', ['ngResource']);
clogService.factory('Projects', ['$resource', function($resource) {
	var fact = $resource('/api/:userid/projects.json',{},{'query': {method:'GET', isArray: true}});
	return fact;
}]);

clogService.factory('Tests', ['$resource', function ($resource) {
	var fact = $resource('/api/posttest', {}, {'testuser': {method: 'POST'}});
	return fact;
}]);