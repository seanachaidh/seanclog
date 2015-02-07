var seanclogprofile = angular.module('SeanclogProfile', ['ngCookies']);

seanclogprofile.controller('ProfileController', ['$scope', '$cookies',
function($scope, $cookies) {
	
	$scope.saveProfile = function(prof) {
		//bewaar hier een profiel
	};
	
	$scope.savePassword = function(pass) {
		//opslaan van een wachtwoord
	};
	
}]);
