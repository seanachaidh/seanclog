/**
 * De controllers van mijn app
 * auteur: Pieter Van Keymeulen
 */
var seanControllers = angular.module('seanClogControllers', ['seanClogServices', 'ngRoute']);

seanControllers.controller('ProjectController', ['$scope', '$routeParams', 'Projects', function($scope, $routeParams, Projects){
	Projects.query({userid: $routeParams.uid}, function(project) {
		$scope.projects = project;
	});
}]);