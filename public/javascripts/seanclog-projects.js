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

	loadData();
	
	$scope.createProj = function(proj) {
		var tmp = angular.copy(proj);
		Projects.post({access_token: $cookies.token}, proj, function(res){
			if(res.value == true) {
				toastr.success('the project has been saved');
			} else {
				toastr.error('the project has not been saved');
			}
			loadData();
		});
	};
	
	$scope.deleteProject = function(projid) {
		
		Projects.remove({id: projid, access_token: $cookies.token}, function(retval) {
			if(retval.value == true) {
				toastr.success('the project has been removed');
			} else {
				toastr.error('the project has not been removed');
			}
			loadData();
		});
		//~ console.log(projid);
	};
	
	$scope.showEditProject = function(project) {
		$scope.toedit = angular.copy(project);
	};
	
	$scope.editProject = function(project) {
		Projects.update({id: project._id, access_token: $cookies.token}, project, function(data) {
			if(data.value == true) {
				toastr.success('the project has been updated');
			} else {
				toastr.error('the project has not been updated');
			}
			loadData();
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
	
	function loadData() {
		Projects.query({access_token: $cookies.token},function(proj){
			$scope.data = proj
		});

		Klanten.query({access_token: $cookies.token}, function(c) {
			$scope.clients = c;
		});
	}
}]);

