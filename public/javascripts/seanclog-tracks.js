var seanclogtracks = angular.module('SeanclogTracks', ['ngRoute', 'ngCookies', 'SeanclogProjects', 'ngResource']);

seanclogtracks.factory('Tracks', [ '$resource', function($resource) {
	var fact = $resource('/api/tracks/:id', {}, {
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
		},
		'update': {
			method: 'PUT',
			params: {}
		}
	});
	return fact;
} ]);

seanclogtracks.controller('TracksController',
		['$scope', '$cookies', '$window', '$route', 'Tracks', 'Projects',
	function($scope, $cookies, $window, $route, Tracks, Projects){


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
	
	$scope.createTrack = function(track){
		Tracks.post({access_token: $cookies.token}, angular.copy(track));
		
		$route.reload();
	};

	$scope.deleteTrack = function(track) {
		console.log('Verwijderen Track');
		console.log(track);
		
		Tracks.remove({id: track._id, access_token: $cookies.token}, track);
		$route.reload();
	};
	
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
		Tracks.update({id: track._id, access_token: $cookies.token}, track, function(retval) {
			if(retval.value == false) {
				console.log('Tracks: Bijwerken van track niet gelukt');
			} else {
				console.log('Tracks: Bijwerken van track gelukt');
			}
			
			$route.reload();
		});
	};
	
	$scope.showEditTrack = function(track) {
		$scope.toedit = track;
	};
	
}]);

seanclogtracks.filter('humandate', function() {
	var retval = function(mydate) {
		var tmpdate = new Date(mydate);
		var finalstring = tmpdate.toLocaleString();
		
		return finalstring;
	};
	return retval;
});

