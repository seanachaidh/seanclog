var seanclogproj = angular.module('SeanclogProjects', ['ngRoute', 'ngCookies', 'ngResource', 'SeanclogClients']);

seanclogproj.factory('Projects', [ '$resource', function($resource) {
	var fact = $resource('/api/projects/:id', {}, {
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

seanclogproj.controller('ProjectController', ['$scope', '$route', '$cookies', '$window', 'Projects', 'Klanten', 'toastr',
function($scope, $route, $cookies, $window, Projects, Klanten, toastr){
	$scope.dataView = true;
	//Dans cette function, on utilise le nom "proj" trop beaucoup pour un variable
	Projects.query({access_token: $cookies.token},function(proj){
		$scope.data = proj
	});
	
	Klanten.query({access_token: $cookies.token}, function(c) {
		$scope.clients = c;
	});
	
	$scope.createProj = function(proj) {
		//Est-ce que ce function est necessaire?
		var tmp = angular.copy(proj);
		Projects.post({access_token: $cookies.token}, proj, function(res){
			if(res.value == true) {
				toastr.success('the project has been saved');
			} else {
				toastr.error('the project has not been saved');
			}
		});
		
		//Recharge la page
		//je n'ai pas déjà testé cette function.
		$route.reload();
	};
	
	$scope.deleteProject = function(projid) {
		
		Projects.remove({id: projid, access_token: $cookies.token}, function(retval) {
			if(retval.value == true) {
				toastr.success('the project has been removed');
			} else {
				toastr.error('the project has not been removed');
			}
		});		
		console.log(projid);
		
		$route.reload();
	};
	
	$scope.showEditProject = function(project) {
		$scope.toedit = project;
	};
	
	$scope.editProject = function(project) {
		Projects.update({id: project._id, access_token: $cookies.token}, project, function(data) {
			if(data.value == false) {
				toastr.success('the project has been updated');
			} else {
				toastr('the project has not been updated');
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

