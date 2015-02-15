var seanclogprofile = angular.module('SeanclogProfile', ['ngCookies']);

seanclogprofile.controller('ProfileController', ['$scope', '$cookies', '$route', 'toastr', 'User',
function($scope, $cookies, $route, toastr, User) {
	User.getUser({access_token: $cookies.token}, function(res) {
		$scope.currentUser = res;
	});
	
	$scope.saveProfile = function(prof) {
		User.updateUser({access_token: $cookies.token}, prof, function(res) {
			if(res.value == true) {
				toastr.success('Profile updated');
			} else {
				toastr.error('something went wrong');
			}
		});
		$route.reload();
	};
	
	$scope.savePassword = function(pass) {
		User.changePassword({access_token: $cookies.token}, {wachtwoord: pass.newpass}, function(res) {
			if(res.value == true) {
				toastr.success('password updated');
			} else {
				toastr.error('something went wrong');
			}
		});
		$route.reload();
	};
	
}]);
