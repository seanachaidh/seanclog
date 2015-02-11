//de modules die onze app gebruikt
var express = require('express');
var http = require('http');

//voor https
var https = require('https');
var fs = require('fs');

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

//app.get('/', routes.index);
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
app.post('/api/tracks', passport.authenticate('bearer', {session: false}), clogapi.tracks.saveTrack);
app.post('/api/projects', passport.authenticate('bearer', {session: false}), clogapi.projects.saveProject);
app.post('/api/clients', passport.authenticate('bearer', {session: false}), clogapi.clients.saveClient);

/*
 * Het verwijderen van data
 * Welk record er precies verwijderd moet worden wordt gedetermineerd door de post variabelen
 */
app.del('/api/tracks/:id', passport.authenticate('bearer', {session: false}), clogapi.tracks.deleteTrack);
app.del('/api/projects/:id', passport.authenticate('bearer', {session: false}), clogapi.projects.deleteProject);
app.del('/api/clients/:id', passport.authenticate('bearer', {session: false}), clogapi.clients.deleteClient);

/*
 * Het bijwerken van data
 * Het record dat moet worden bijgewerkt wort bepaald door de gegeven id
 */
app.put('/api/tracks/:id', passport.authenticate('bearer', {session: false}), clogapi.tracks.updateTrack);
app.put('/api/projects/:id', passport.authenticate('bearer', {session: false}), clogapi.projects.updateProject);
app.put('/api/clients/:id', passport.authenticate('bearer', {session: false}), clogapi.clients.updateClient);


app.post('/api/posttest', clogapi.tests.posttest);


/* Het afhandelen van het inloggen van de gebruiker */
app.post('/api/login', passport.authenticate('local', {session: false}), function(req, res) {
	//?gotoapp=1
	if(req.query.gotoapp) {
		/*
		 * Hier gaan we direct naar de webapplicatie
		 */
		res.redirect('/app');
	} else {
		res.json(req.user);
	}
});

/*
 * Gebruikersbeheer
 */
app.post('/api/users', clogapi.auth.createUser);
app.put('/api/users', passport.authenticate('bearer', {session: false}), clogapi.auth.updateUser);
app.del('/api/users', passport.authenticate('bearer', {session: false}), clogapi.auth.removeUser);
app.get('/api/users', passport.authenticate('bearer', {session: false}), clogapi.auth.getUser);

/*
 * Dit komt een beetje vreemd over. Volgens mij maak ik hier beter een
 * nieuwe route van met de naam logout.
 */
app.get('/api/logout', clogapi.auth.performLogout);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
var httpsOptions = {
	key: fs.readFileSync('keys/server.key'),
	cert: fs.readFileSync('keys/server.crt')
};

var httpsserver = https.createServer(httpsOptions, app).listen(8000, function() {
	console.log('Express server with https listening on port 8000');
});

//dit zou normaalgezien een websocketservice moeten maken
var wss = new ws.Server({server: server});
