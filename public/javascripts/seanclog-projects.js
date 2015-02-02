var seanclogproj = angular.module('SeanclogProjects', ['ngRoute', 'ngCookies', 'ngResource']);

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

seanclogproj.controller('ProjectController', ['$scope', '$route', '$cookies', '$window', 'Projects',
function($scope, $route, $cookies, $window, Projects){
	//Dans cette function, on utilise le nom "proj" trop beaucoup pour un variable
	Projects.query({access_token: $cookies.token},function(proj){
		$scope.data = proj
	});
	
	$scope.createProj = function(proj) {
		//Est-ce que ce function est necessaire?
		var tmp = angular.copy(proj);
		Projects.post({access_token: $cookies.token}, proj);
		angular.element("#createModal").modal("hide");
		
		//Recharge la page
		//je n'ai pas déjà testé cette function.
		$route.reload();
	};
	
	$scope.deleteProject = function(projid) {
		
		Projects.remove({id: projid, access_token: $cookies.token}, function(retval) {
			if(retval.value == true) {
				console.log('het verwijderen van het project is gelukt');
			} else {
				console.log('het verwijderen van het project is niet gelukt');
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
				console.log('updaten project niet gelukt');
			} else {
				console.log('updaten project gelukt');
			}
		});
		
	};
	
}]);

