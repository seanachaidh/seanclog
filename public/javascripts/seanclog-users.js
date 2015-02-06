/*
 * Deze module regelt zowel het loginsystem als het beheren van gebruikers
 */

var seanclogusers = angular.module('SeanclogUsers', ['ngRoute', 'ngCookies', 'ngResource']);

seanclogusers.factory('Login', ['$resource', function($resource) {
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

seanclogusers.factory('User', ['$resource', function($resource) {
	var fact = $resource('/api/user', {}, {
		'createUser': {
			method: 'POST',
			params: {}
		}
	});
	return fact;
}]);


seanclogusers.factory('Token', function() {
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

seanclogusers.controller('LoginController', ['$scope', '$cookies', 'Login', '$location', 'User',
function($scope, $cookies, Login, $location, User){
	$scope.dologin = function(user) {
		Login.getToken({username: user.username, password: user.password}, function(u, status) {
			$cookies.token = u.token;
			/*
			 * Tracks is onze standaardpagina
			 */
			$location.path('tracks');
		});
	};
	
	$scope.createUser = function(user) {
		User.createUser(user, function(retval) {
			if(retval.value == true) {
				console.log('maken van gebruiker gelukt');
			}
			//wat moet ik doen wanneer het maken van een gebruiker faalt?
		});
	};
	
}]);
