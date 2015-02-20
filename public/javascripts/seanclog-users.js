/*
 * Deze module regelt zowel het loginsystem als het beheren van gebruikers
 */

var seanclogusers = angular.module('SeanclogUsers', ['ngRoute', 'ngCookies', 'ngResource', 'SeanclogSecurity']);

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
	var fact = $resource('/api/users', {}, {
		'createUser': {
			method: 'POST',
			params: {}
		},
		'getUser': {
			method: 'GET',
			params: {},
			isArray: false
		},
		'updateUser': {
			method: 'PUT',
			isArray: false,
			params: {}
		},
		'changePassword': {
			method: 'PUT',
			isArray: false,
			params: {},
			url: '/api/users/changepassword'
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

seanclogusers.controller('LoginController', ['$scope', '$cookies', 'Login', '$location', 'gettextCatalog', 'toastr', 'User',
function($scope, $cookies, Login, $location, gettextCatalog, toastr, User){
	$scope.dologin = function(user) {
		Login.getToken({username: user.username, password: user.password}, function(u, status) {
			$cookies.token = u.token;
			/*
			 * Tracks is onze standaardpagina
			 */
			$location.path('tracks');
		}, function(error) {
			if(error.status == 401) {
				$scope.usererror = true;
			}
		});
	};
	
	$scope.createUser = function(user) {
		User.createUser(user, function(retval) {
			if(retval.value == true) {
				console.log('maken van gebruiker gelukt');
				toastr.success('A validation mail has been sended');
			} else {
				console.log('het maken van de gebruiker is mislukt');
			}
			//wat moet ik doen wanneer het maken van een gebruiker faalt?
		});
	};
	
	$scope.setLanguage = function(toset) {
		$cookies.lang = toset;
		gettextCatalog.setCurrentLanguage(toset);
	};
}]);
