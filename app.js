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
clogapi.auth.initpassport(app); //dit mag niet van plek veranderen
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



/*
 * Alles dat te maken heeft met authenticatie
 */

clogapi.auth.passroute(app);


/* ------------------------------------------ */

if('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/app', routes.app);

/**
 * Het verkrijgen van data
 */
app.get('/api/tracks', clogapi.tracks.getTracksOfUser);
app.get('/api/projects', clogapi.projects.getProjectsOfUser);
app.get('/api/clients', clogapi.clients.getClientsOfUser);

/*
 * commandes de pdf
 */

app.get('/api/createpdf/tracks');
app.get('/api/createpdf/projects');
app.get('/api/createpdf/clients');

/**
 * Het opslaan van data
 */
app.post('/api/tracks', clogapi.tracks.saveTrack);
app.post('/api/projects', clogapi.projects.saveProject);
app.post('/api/clients', clogapi.clients.saveClient);

app.post('/api/posttest', clogapi.tests.posttest);


var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
//dit zou normaalgezien een websocketservice moeten maken
var wss = new ws.Server({server: server});
