/**
 * De controllers van mijn app
 * auteur: Pieter Van Keymeulen
 */
var seanControllers = angular.module('seanClogControllers',['seanClogServices', 'ngRoute', 'ngCookies']);

seanControllers.controller('ProjectController', ['$scope', '$route', '$cookies', 'Projects',
function($scope, $route, $cookies, Projects){
	//Dans cette function, on utilise le nom "proj" trop beaucoup pour un variable
	Projects.query({access_token: $cookies.token},function(proj){
		$scope.data = proj;
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
		['$scope', '$cookies', 'Tracks', 'Projects',
		 function($scope, $cookies, Tracks, Projects){
			//choisit la dialogue pour faire des tracks
			$scope.createForm = '/partials/forms/form_createtrack.html';
			$scope.createTrack = function(track){
				Tracks.post(angular.copy(track));
				angular.element('#createModal').modal('hide');
				
				$route.reload();
			};
			
			Tracks.query({access_token: $cookies.token}, function(t){
				$scope.data = t;
			});
			/*
			 * Nous avons besoin de tous les projects de l' utilisateur
			 * Ansi l' utilisateur peut choisisez un project 
			 */
			Projects.query({access_token: $cookies.token}, function(proj){
				$scope.projects = proj;
			});
		}]);

seanControllers.controller('KlantenController', ['$scope', '$route', '$cookies', 'Klanten',
function($scope, $route, $cookies, Klanten){
	Klanten.query({access_token: $cookies.token}, function(k) {
		$scope.data = k;
	});
	$scope.createForm = "/partials/forms/form_createclient.html";
	
	$scope.createclient = function(client) {
		Klanten.post(angular.copy(client));
		angular.element("#createModal").modal('hide');
		$route.reload();
	};
	
}]);

//Een controller die het inloggen van gebruikers regelt
seanControllers.controller('LoginController', ['$scope', '$cookies', 'Login', '$location',
function($scope, $cookies, Login, $location){
	$scope.dologin = function(user) {
		Login.getToken({username: user.username, password: user.password}, function(u) {
			$cookies.token = u.token;
			/*
			 * Tracks is onze standaardpagina
			 */
			$location.path('tracks');
		});
	};
}]);

seanControllers.controller('ProfileController', ['$scope', '$cookies',
function($scope, $cookies) {
	console.log('token: ' + $cookies.token);
}]);


seanControllers.controller('TestController', ['$scope', 'Tests', function($scope, Tests) {
	var resp = Tests.testuser({gebruikersnaam: 'Testuser', naam:'Pieter', wachtwoord:'12345', email:'hello@hello.com'});
	$scope.resp = resp;
}]);

