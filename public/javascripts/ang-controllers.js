/**
 * De controllers van mijn app
 * auteur: Pieter Van Keymeulen
 */
var seanControllers = angular.module('seanClogControllers',['seanClogServices', 'ngRoute']);

seanControllers.controller('ProjectController', ['$scope', '$route', '$routeParams', 'Projects',
function($scope, $route, $routeParams, Projects){
	//Dans cette function, on utilise le nom "proj" trop beaucoup pour un variable
	
	$scope.tableTitle = "Mijn Projecten";
	Projects.query({access_token: $routeParams.access_token},function(proj){
		$scope.myData = proj;
		$scope.createForm = '/partials/forms/form_createproject.html';
		$scope.createProj = function(proj) {
			//Est-ce que ce function est necessaire?
			var tmp = angular.copy(proj);
			Projects.post(proj);
			angular.element("#createModal").modal("hide");
			
			//Recharge la page
			//je n'ai pas déjà testé cette function.
			$route.reload();
		}
	});
}]);

seanControllers.controller('TracksController',
		['$scope', '$routeParams', 'Tracks', 'Projects',
		 function($scope, $routeParams, Tracks, Projects){
			$scope.tableTitle = "Mijn Tracks";
			//choisit la dialogue pour faire des tracks
			$scope.createForm = '/partials/forms/form_createtrack.html';
			$scope.createTrack = function(track){
				//ik moet nog nakijken of deze functie wel degelijk werkt.
				Tracks.post(angular.copy(track));
				angular.element('#createModal').modal('hide');
				
				$route.reload();
			};
			
			Tracks.query(function(t){
				$scope.myData = t;
			});
			/*
			 * Nous avons besoin de tous les projects de l' utilisateur
			 * Ansi l' utilisateur peut choisisez un project 
			 */
			Projects.query(function(proj){
				$scope.projects = proj;
			});
		}]);

seanControllers.controller('TestController', ['$scope', 'Tests', function($scope, Tests) {
	var resp = Tests.testuser({gebruikersnaam: 'Testuser', naam:'Pieter', wachtwoord:'12345', email:'hello@hello.com'});
	$scope.resp = resp;
}]);

seanControllers.controller('KlantenController', ['$scope', '$route', 'Klanten', function($scope, $route, Klanten){
	$scope.tableTitle = "Mijn Klanten";
	Klanten.query(function(k) {
		$scope.myData = k;
	});
	$scope.createForm = "/partials/forms/form_createclient.html";
	
	$scope.createclient = function(client) {
		Klanten.post(angular.copy(client));
		angular.element("#createModal").modal('hide');
		$route.reload();
	};
	
}]);
