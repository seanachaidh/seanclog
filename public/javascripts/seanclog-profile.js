var seanclogprofile = angular.module('SeanclogProfile', ['ngCookies']);

seanclogprofile.controller('ProfileController', ['$scope', '$cookies', 'User',
function($scope, $cookies, User) {
	User.getUser({access_token: $cookies.token}, function(res) {
		$scope.currentUser = res;
	});
	
	$scope.saveProfile = function(prof) {
		//bewaar hier een profiel
	};
	
	$scope.savePassword = function(pass) {
		//opslaan van een wachtwoord
	};
	
}]);
