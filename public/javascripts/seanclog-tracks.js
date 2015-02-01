var seanclogtracks = angular.module('SeanclogTracks', ['ngRoute', 'ngCookies', 'SeanclogProjects', 'ngResource']);

seanclogtracks.factory('Tracks', [ '$resource', function($resource) {
	var fact = $resource('/api/tracks', {}, {
		'query' : {
			method : 'GET',
			isArray : true
		},
		'post' : {
			method : 'POST',
			params : {}
		},
		'remove': {
			method: 'DELETE',
			params: {}
		}
	});
	return fact;
} ]);

seanclogtracks.controller('TracksController',
		['$scope', '$cookies', '$window', 'Tracks', 'Projects',
	function($scope, $cookies, $window, Tracks, Projects){
	$scope.createTrack = function(track){
		Tracks.post({access_token: $cookies.token}, angular.copy(track));
		angular.element('#createModal').modal('hide');
		
		$route.reload();
	};

	$scope.deleteTrack = function(track) {
		$window.alert("nog niet gemaakt");
		console.log("Track verwijderen");
		console.log(track);
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
	
	$scope.openBegin = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		
		$scope.beginOpened = true;
	};
	
	$scope.openEnd = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		
		$scope.endOpened = true;
	};
	
	$scope.editTrack = function(track) {
		//hier gaan we een track bijwerken
	};
	
	$scope.showEditTrack = function(track) {
		//hier tonen we de dialoog om een track bij te werken
	};
	
}]);
