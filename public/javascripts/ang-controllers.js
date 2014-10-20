/**
 * De controllers van mijn app
 * auteur: Pieter Van Keymeulen
 */
var seanControllers = angular.module('seanClogControllers', ['seanClogServices', 'ngRoute']);

seanControllers.controller('ProjectController', ['$scope', '$routeParams', 'Projects', 'Session',
function($scope, $routeParams, Projects, Session){
	/*
	 * Verkrijg het gebruikersindentificatienummer van de gebruiker die
	 * op dit moment aangemeld is.
	 */
	var uid = Session.getCurrentUser()._id;
	Projects.query({userid: uid}, function(proj){
		//volgens mij geeft dit maar één project terug. De variable wordt telkens overschreven
		$scope.projects = proj;
	});
}]);
seanControllers.controller('TestController', ['$scope', 'Tests', function($scope, Tests) {
	var resp = Tests.testuser({gebruikersnaam: 'Testuser', naam:'Pieter', wachtwoord:'12345', email:'hello@hello.com'});
	$scope.resp = resp;
}]);