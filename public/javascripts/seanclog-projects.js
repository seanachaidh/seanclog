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
		},
		'getHours' : {
			method: 'GET',
			isArray: true,
			url: '/api/tracks/hours',
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
	
	$scope.filterResults = function(tofilter) {
		
		if(tofilter.length > 0) {
			Projects.query({access_token: $cookies.token, search: tofilter}, function(proj) {
				$scope.data = proj;
			});
		} else {
			Projects.query({access_token: $cookies.token}, function(proj) {
				$scope.data = proj;
			});
		}
	};
	
	function loadData() {
		Projects.query({access_token: $cookies.token},function(proj){
			Projects.getHours({access_token: $cookies.token}, function(c) {
				for(var i = 0; i < c.length; i++) {
					var hour = c[i];
					for(var x = 0; x < proj.length; x++) {
						var p = proj[x];
						if(p._id == hour._id) {
							proj[x].hours = hour.value
						}
					}
				}
				$scope.data = proj;
			});
		});

		Klanten.query({access_token: $cookies.token}, function(c) {
			$scope.clients = c;
		});
	}
}]);

seanclogproj.filter('filterhours', ['$scope', function($scope) {
	var retval = function(projid) {
		searchProject  = function(elem) {
			return elem._id = projid;
		}
		finalproj = $scope.hours.filter(searchProject);
		return finalproj.value;
	};
	
	return retval;
}]);
