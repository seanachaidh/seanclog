/**
 * De controllers van mijn app
 * auteur: Pieter Van Keymeulen
 */
var seanControllers = angular.module('seanClogControllers',['seanClogServices', 'ngRoute']);

seanControllers.controller('ProjectController', ['$scope', '$routeParams', 'Projects',
function($scope, $routeParams, Projects){
	$scope.tableTitle = "Mijn Projecten";
	Projects.query(function(proj){
		$scope.myData = proj;
		$scope.createForm = '/partials/forms/form_createproject.html';
		$scope.createProj = function(proj) {
			//estas tiu funkcio necesa?
			var tmp = angular.copy(proj);
			//post la kreo de la projecta. fermu la fenestra
			Projects.post(proj);
		}
	});
}]);

seanControllers.controller('TracksController',
		['$scope', '$routeParams', 'Tracks', function($scope, $routeParams, Tracks){
			$scope.tableTitle = "Mijn Tracks";
			Tracks.query(function(t){
				$scope.myData = t;
			}); 
		}]);

seanControllers.controller('TestController', ['$scope', 'Tests', function($scope, Tests) {
	var resp = Tests.testuser({gebruikersnaam: 'Testuser', naam:'Pieter', wachtwoord:'12345', email:'hello@hello.com'});
	$scope.resp = resp;
}]);

seanControllers.controller('KlantenController', ['$scope', 'Klanten', function($scope, Klanten){
	$scope.tableTitle = "Mijn Klanten";
	Klanten.query(function(k) {
		$scope.myData = k;
	})
}]);
