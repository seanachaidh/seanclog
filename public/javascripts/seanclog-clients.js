var seanclogclient = angular.module('SeanclogClients', ['ngRoute', 'ngCookies', 'ngResource']);

seanclogclient.factory('Klanten', [ '$resource', function($resource) {
	var fact = $resource('/api/clients/:id', {}, {
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

seanclogclient.controller('ClientController', ['$scope', '$route', '$cookies', '$window', 'Klanten',
function($scope, $route, $cookies, $window, Klanten){
	Klanten.query({access_token: $cookies.token}, function(k) {
		$scope.data = k;
	});
	
	$scope.createclient = function(client) {
		Klanten.post({access_token: $cookies.token}, angular.copy(client));
		$route.reload();
	};
	
	$scope.deleteClient = function(client) {
		
		Klanten.remove({id: client, access_token: $cookies.token}, function(retval) {
			if(retval.value == true) {
				console.log('het verwijderen van de klant is gelukt');
			} else {
				console.log('het verwijderen van de klant is niet geluk');
			}
		});
		console.log(client);
		$route.reload();
	};
	
	$scope.showEditClient = function(client) {
		$scope.toedit = client;
	};
	
	$scope.editClient = function(client) {
		//hier werken we een klant bij
	};
	
}]);

