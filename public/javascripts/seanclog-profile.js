var seanclogprofile = angular.module('SeanclogProfile', ['ngCookies']);

seanclogprofile.controller('ProfileController', ['$scope', '$cookies',
function($scope, $cookies) {
	console.log('token: ' + $cookies.token);
}]);
