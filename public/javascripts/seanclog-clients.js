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
		},
		'update': {
			method: 'PUT',
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
		Klanten.update({id: client._id, access_token: $cookies.token}, client, function(retval) {
			if(retval.value == false) {
				console.log('Klanten: het bijwerken is niet gelukt');
			} else {
				console.log('Klanten: Het bijwerken is gelukt');
			}
		});
	};
	
	
	
	/*
	 * Ik moet een methode vinden waarin deze functie niet in elke
	 * controller moet voorkomen
	 */
	var original = null;
	$scope.filterResults = function(tofilter) {
		var exp = RegExp(tofilter);
		
		if(original != null){
			$scope.data = angular.copy(original);
		} else {
			original = angular.copy($scope.data);
		}
		
		var filteredData = $scope.data.filter(function(element) {
			var result = false;
			for(prop in element) {
				if(element.hasOwnProperty(prop)) {
					if(exp.test(element[prop]) == true) result = true;
				}
			}
			return result;
		});
		
		$scope.data = angular.copy(filteredData);
	};
	
}]);

