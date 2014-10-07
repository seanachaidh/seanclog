/**
 * De controllers van mijn app
 * auteur: Pieter Van Keymeulen
 */
var seanControllers = angular.module('seanClogControllers', ['seanClogServices', 'ngRoute']);

seanControllers.controller('ProjectController', ['$scope', '$routeParams', function($scope, $routeParams){
	//var projects = Projects.get({userid: $routeParams.uid});
	$scope.projects = 'hello world';
}]);