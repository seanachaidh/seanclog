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
		['$scope', '$cookies', '$window', '$route', 'Tracks', 'Projects', 'toastr',
	function($scope, $cookies, $window, $route, Tracks, Projects, toastr){


	Tracks.query({access_token: $cookies.token, include_projects: true}, function(t){
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
		Tracks.post({access_token: $cookies.token}, angular.copy(track), function(res) {
			if(res.value == false) {
				toastr.error('Track is not saved');
			} else {
				toastr.success('Track has been saved');
			}
		});
		
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
				toastr.error('the track has not been updated');
			} else {
				toastr.success('the track has been updated');
			}
			
			$route.reload();
		});
	};
	
	$scope.showEditTrack = function(track) {
		$scope.toedit = track;
	};
	
	/*
	 * Ik moet een methode vinden waarin deze functie niet in elke
	 * controller moet voorkomen
	 */
	var original = null;
	$scope.filterResults = function(tofilter) {
		var exp = RegExp(tofilter);
		
		if(original != null){
			$scope.data = angular.copy(original);
		} else {
			original = angular.copy($scope.data);
		}
		
		var filteredData = $scope.data.filter(function(element) {
			var result = false;
			for(prop in element) {
				if(element.hasOwnProperty(prop)) {
					if(exp.test(element[prop]) == true) result = true;
				}
			}
			return result;
		});
		
		$scope.data = angular.copy(filteredData);
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

