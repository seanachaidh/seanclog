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
		angular.element("#createModal").modal('hide');
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
		 //~ $window.alert("nog niet geïmplementeerd");
		 console.log('editclient functie');
		 
		 $scope.chosenName = client.naam;
		 $scope.chosenEmail = client.email;
		 $scope.chosenTel = client.telefoonnummer;
		 
		 angular.element('#createModal').modal('show');
	 
	};
	
	$scope.editClient = function(client) {
		//hier werken we een klant bij
	};
	
}]);

