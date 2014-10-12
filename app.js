//de modules die onze app gebruikt
var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var clogapi = require('./api');

var monk = require('monk');

var app = express();

var db = monk('mongodb://pietervk:ragnarok@lennon.mongohq.com:10094/app29880742');

app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	req.db = db;
	next();
});

if('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/api/:userid/tracks', clogapi.tracks.getTracksOfUser);
app.get('/api/:userid/projects.json', clogapi.projects.getProjectsOfUser);
app.post('/api/posttest', clogapi.tests.posttest);
app.post('/login')

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
