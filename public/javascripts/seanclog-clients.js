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

seanclogclient.controller('ClientController', ['$scope', '$route', '$cookies', '$window', 'Klanten', 'toastr',
function($scope, $route, $cookies, $window, Klanten, toastr){
	$scope.dataView = true;
	
	$scope.showMenu = true;
	
	loadData();
	
	$scope.createclient = function(client) {
		Klanten.post({access_token: $cookies.token}, angular.copy(client), function(res) {
			if(res.value == true) {
				toastr.success('The client has been saved');
			} else {
				toastr.error('The client has not been saved');
			}
			loadData();
		});
	};
	
	$scope.deleteClient = function(client) {
		Klanten.remove({id: client, access_token: $cookies.token}, function(retval) {
			if(retval.value == true) {
				toastr.success('Client has been removed');
			} else {
				toastr.error('Client has not been removed');
			}
			loadData();
		});
		//~ console.log(client);
	};
	
	$scope.showEditClient = function(client) {
		$scope.toedit = angular.copy(client);
	};
	
	$scope.editClient = function(client) {
		Klanten.update({id: client._id, access_token: $cookies.token}, client, function(retval) {
			if(retval.value == false) {
				toastr.error('the client has not been updated');
			} else {
				toastr.success('the client has been updated');
			}
			loadData();
		});
	};
	
	$scope.filterResults = function(tofilter) {
		if(tofilter.length > 0) {
			Klanten.query({access_token: $cookies.token, search: tofilter}, function(k) {
				$scope.data = k;
			});
		} else {
			Klanten.query({access_token: $cookies.token}, function(k) {
				$scope.data = k;
			});
		}
	};
		
	function loadData() {
		Klanten.query({access_token: $cookies.token}, function(k) {
			$scope.data = k;
		});
	}
}]);
