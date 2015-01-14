/*
 * in dit bestand zitten de "diensten" van mijn project
 */

var clogService = angular.module('seanClogServices', [ 'ngResource' ]);
clogService.factory('Projects', [ '$resource', function($resource) {
	var fact = $resource('/api/projects', {}, {
		'query' : {
			method : 'GET',
			isArray : true
		},
		'post' : {
			method : 'POST',
			params : {}
		},
		'remove': {
			method: 'DELETE',
			params: {}
		}
	});
	return fact;
} ]);

clogService.factory('Tests', [ '$resource', function($resource) {
	var fact = $resource('/api/posttest', {}, {
		'testuser' : {
			method : 'POST'
		}
	});
	return fact;
} ]);

/**
 * Deze functie is verouderd. Dit omdat deze functie is onnodig is omdat we er
 * nu in elke functie direct gebruik maken van de user
 */
clogService.factory('Session', [ '$resource', function($resource) {
	var fact = $resource('/api/:varname');
} ]);

clogService.factory('Tracks', [ '$resource', function($resource) {
	var fact = $resource('/api/tracks', {}, {
		'query' : {
			method : 'GET',
			isArray : true
		},
		'post' : {
			method : 'POST',
			params : {}
		},
		'remove': {
			method: 'DELETE',
			params: {}
		}
	});
	return fact;
} ]);

clogService.factory('Klanten', [ '$resource', function($resource) {
	var fact = $resource('/api/clients', {}, {
		'query' : {
			method : 'GET',
			isArray : true
		},
		'post' : {
			method : 'POST',
			params : {}
		},
		'remove': {
			method: 'DELETE',
			params: {}
		}
	});
	return fact;
} ]);

clogService.factory('Login', ['$resource', function($resource) {
	var fact = $resource('/api/login', {}, {
		'getToken' : {
			method : 'POST',
			params : {}
		},
		'logout': {
			method: 'GET',
			params: {},
			url: '/api/logout'
		}
	});	
	return fact;
}]);
	

clogService.factory('Token', function() {
	var currentToken;
	var retval = {
		setToken: function(toset) {
			currentToken = toset;
		},
		getToken: function() {
			return currentToken;
		}
	};
	
	return retval;
});
