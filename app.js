//de modules die onze app gebruikt
var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var clogapi = require('./api');
var passport = require('passport');
var ws = require('ws');

var app = express();

app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '72854'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//ervoor zorgen dat we bower components kunnen gebruiken
app.use(express.static(path.join(__dirname, 'bower_components')));

/* ------------------------------------------ */

if('development' == app.get('env')) {
	app.use(express.errorHandler());
}

require('./api/auth');

app.get('/', routes.index);
app.get('/app', routes.app);

/*
 * Het verkrijgen van data
 */
app.get('/api/tracks', passport.authenticate('bearer', {session: false}), clogapi.tracks.getTracksOfUser);
app.get('/api/projects', passport.authenticate('bearer', {session: false}), clogapi.projects.getProjectsOfUser);
app.get('/api/clients', passport.authenticate('bearer', {session: false}), clogapi.clients.getClientsOfUser);

/*
 * commandes de pdf
 */

app.get('/api/tracks/createpdf');
app.get('/api/projects/createpdf');
app.get('/api/clients/createpdf');

/*
 * Het opslaan van data
 */
app.post('/api/tracks', clogapi.tracks.saveTrack);
app.post('/api/projects', clogapi.projects.saveProject);
app.post('/api/clients', clogapi.clients.saveClient);

/*
 * Het verwijderen van data
 * Welk record er precies verwijderd moet worden wordt gedetermineerd door de post variabelen
 */
app.del('/api/tracks', clogapi.tracks.deleteTrack);
app.del('/api/projects', clogapi.projects.deleteProject);
app.del('/api/clients', clogapi.clients.deleteClient);


app.post('/api/posttest', clogapi.tests.posttest);


/* Het afhandelen van het inloggen van de gebruiker */
app.post('/login', passport.authenticate('local'), function(req, res) {
	//?gotoapp=1
	if(req.query.gotoapp) {
		/*
		 * Hier gaan we direct naar de webapplicatie
		 */
		res.redirect('/app');
	} else {
		/*
		 * hier sturen we enkel een jsonobject door met hierin de verificatie dat de
		 * authenticatie juist is verlopen
		 * Dit is handig voor het maken van extra clients, zoals mijn eigen android applicatie
		 */
		var username = req.user.gebruikersnaam;
		//ik moet hier een aparte token van maken
		var ttoken = req.user._id;
		var retval = {
			success: true,
			gebruikersnaam: username,
			token: ttoken
		};
		res.json(retval);
	}
});

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
//dit zou normaalgezien een websocketservice moeten maken
var wss = new ws.Server({server: server});
