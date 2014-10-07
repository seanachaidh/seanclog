/*
 * in dit bestand zitten de "diensten" van mijn project
 */

var clogService = angular.module('seanClogServices', ['ngResource']);
clogService.factory('Projects', function($resource) {
	var fact = $resource('/:userid/projects',{},{ query: {method:'GET', params: {userid: 'user'}, isArray: true}});
	return fact;
});