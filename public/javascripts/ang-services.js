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

/*
 * ik moet deze functie nog testen.
 * Ik moet ervoor zorgen dat ik hier de angular resource gebruik in plaats van
 * de 'verouderde' http service
 */
clogService.factory('Session', ['$resource', function($resource) {
	var fact = {};
	var result;
	
	fact.getCurrentUser = function() {
		var cur = $resource('/api/currentuser', {});
		var retval = cur.get();
		
		return retval;
	};
	
	fact.saveToSession = function(key, value) {
		//bewaar een variabele naar de sessie
	}
	
	fact.getFromSession = function(key) {
		//krijg een variabele van de sessie
	};
	
	return fact;
}]);
