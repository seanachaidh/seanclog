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
clogService.factory('Session', ['$http', function($http) {
	var fact = {};
	
	//TODO: Vervang dit door dubbelepuntnotatie
	/*
	 * fact = {
	 *   dosomething: function() {
	 *     code voor dosomething
	 *   }
	 * }
	 */
	
	/*
	 * Verkrijg de huidige gebruiker van de sessie
	 */
	fact.getCurrentUser = function() {
		var retval = $http.get('/api/currentuser')
		.success(function(r) {
			return r;
		});
		return retval;
	};
	
	fact.saveToSession = function(key, value) {
		//bewaar een variable naar de sessie
	};
	fact.getFromSession = function(key) {
		//Verkrijg een variable van de sessie
		//dummy code
		var retval = 'dummy';
		return retval;
	};
	
	return fact;
}]);