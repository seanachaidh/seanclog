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
		['$scope', '$cookies', '$window', '$route', '$rootScope', 'Tracks', 'Projects', 'toastr',
	function($scope, $cookies, $window, $route, $rootScope, Tracks, Projects, toastr){
	$scope.dataView = true;
	
	loadData();
	
	$scope.createTrack = function(track){
		Tracks.post({access_token: $cookies.token}, angular.copy(track), function(res) {
			if(res.value == false) {
				toastr.error('Track is not saved');
			} else {
				toastr.success('Track has been saved');
			}
			loadData();
		});
	};

	$scope.deleteTrack = function(track) {
		Tracks.remove({id: track._id, access_token: $cookies.token}, track, function(retval) {
			if(retval.value == true) {
				toastr.success('track has been deleted');
			} else {
				toastr.error('Track has not been removed');
			}
			loadData();
		});
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
			
			loadData();
		});
	};
	
	$scope.showEditTrack = function(track) {
		$scope.toedit = angular.copy(track);
	};
	
	/*
	 * Ik moet een methode vinden waarin deze functie niet in elke
	 * controller moet voorkomen
	 */
	//~ var original = null;
	//~ $scope.filterResults = function(tofilter) {
		//~ var exp = RegExp(tofilter);
		//~ 
		//~ if(original != null){
			//~ $scope.data = angular.copy(original);
		//~ } else {
			//~ original = angular.copy($scope.data);
		//~ }
		//~ 
		//~ var filteredData = $scope.data.filter(function(element) {
			//~ var result = false;
			//~ for(prop in element) {
				//~ if(element.hasOwnProperty(prop)) {
					//~ if(exp.test(element[prop]) == true) result = true;
				//~ }
			//~ }
			//~ return result;
		//~ });
		//~ 
		//~ $scope.data = angular.copy(filteredData);
	//~ };
	
	$scope.filterResults = function(tofilter) {
		if(tofilter.length > 0) {
			Tracks.query({access_token: $cookies.token, include_projects:true, search: tofilter}, function(t) {
				$scope.data = t;
			});
		} else {
			Tracks.query({access_token: $cookies.token, include_projects: true}, function(t) {
				$scope.data = t;
			});
		}
	};
	
	function loadData() {
		Tracks.query({access_token: $cookies.token, include_projects: true}, function(t){
			$scope.data = t;
		});
		
		Projects.query({access_token: $cookies.token}, function(proj){
			$scope.projects = proj;
		});
	}
}]);

seanclogtracks.filter('humandate', function() {
	var retval = function(mydate) {
		var tmpdate = new Date(mydate);
		var finalstring = tmpdate.toLocaleString();
		
		return finalstring;
	};
	return retval;
});

