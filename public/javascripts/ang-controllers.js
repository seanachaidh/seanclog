/**
 * De controllers van mijn app
 * auteur: Pieter Van Keymeulen
 */
var seanControllers = angular.module('seanClogControllers',['seanClogServices', 'ngRoute', 'ngCookies']);

seanControllers.controller('ProjectController', ['$scope', '$route', '$cookies', '$window', 'Projects',
function($scope, $route, $cookies, $window, Projects){
	//Dans cette function, on utilise le nom "proj" trop beaucoup pour un variable
	Projects.query({access_token: $cookies.token},function(proj){
		$scope.data = proj
	});
	
	$scope.createProj = function(proj) {
		//Est-ce que ce function est necessaire?
		var tmp = angular.copy(proj);
		Projects.post({access_token: $cookies.token}, proj);
		angular.element("#createModal").modal("hide");
		
		//Recharge la page
		//je n'ai pas déjà testé cette function.
		$route.reload();
	};
	
	$scope.deleteProject = function(projid) {
		
		Projects.remove({id: projid, access_token: $cookies.token}, function(retval) {
			if(retval.value == true) {
				console.log('het verwijderen van het project is gelukt');
			} else {
				console.log('het verwijderen van het project is niet gelukt');
			}
		});		
		console.log(projid);
		
		$route.reload();
	};
	
	$scope.showEditProject = function(project) {
		var titelInput = angular.element('#titelInput');
		var prijsInput = angular.element('#prijsInput');
		
		titelInput.val(project.titel);
		prijsInput.val(project.prijs);
		
		angular.element('#editModal').modal('show');
	};
	
	$scope.editProject = function(project) {
		//hier gaan we een project bijwerken.
	};
	
}]);

seanControllers.controller('TracksController',
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

seanControllers.controller('KlantenController', ['$scope', '$route', '$cookies', '$window', 'Klanten',
function($scope, $route, $cookies, $window, Klanten){
	Klanten.query({access_token: $cookies.token}, function(k) {
		$scope.data = k;
	});
	
	$scope.createclient = function(client) {
		Klanten.post({access_token: $cookies.token}, angular.copy(client));
		angular.element("#createModal").modal('hide');
		$route.reload();
	};
	
	$scope.deleteClient = function(client) {
		
		Klanten.remove({id: client, access_token: $cookies.token}, function(retval) {
			if(retval.value == true) {
				console.log('het verwijderen van de klant is gelukt');
			} else {
				console.log('het verwijderen van de klant is niet geluk');
			}
		});
		

		
		console.log(client);
		$route.reload();
	};
	
	$scope.showEditClient = function(client) {
		 //~ $window.alert("nog niet geïmplementeerd");
		 console.log('editclient functie');
		 
		 $scope.chosenName = client.naam;
		 $scope.chosenEmail = client.email;
		 $scope.chosenTel = client.telefoonnummer;
		 
		 angular.element('#createModal').modal('show');
	 
	};
	
	$scope.editClient = function(client) {
		//hier werken we een klant bij
	};
	
}]);

//Een controller die het inloggen van gebruikers regelt
seanControllers.controller('LoginController', ['$scope', '$cookies', 'Login', '$location', 'User',
function($scope, $cookies, Login, $location, User){
	$scope.dologin = function(user) {
		Login.getToken({username: user.username, password: user.password}, function(u) {
			$cookies.token = u.token;
			/*
			 * Tracks is onze standaardpagina
			 */
			$location.path('tracks');
		});
	};
	
	$scope.createUser = function(user) {
		User.createUser(user, function(retval) {
			if(retval.value == true) {
				angular.element("#createModal").modal('hide');
			}
			//wat moet ik doen wanneer het maken van een gebruiker faalt?
		});
	};
	
}]);

seanControllers.controller('ProfileController', ['$scope', '$cookies',
function($scope, $cookies) {
	console.log('token: ' + $cookies.token);
}]);


seanControllers.controller('TestController', ['$scope', 'Tests', function($scope, Tests) {
	var resp = Tests.testuser({gebruikersnaam: 'Testuser', naam:'Pieter', wachtwoord:'12345', email:'hello@hello.com'});
	$scope.resp = resp;
}]);

