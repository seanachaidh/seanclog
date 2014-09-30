//de modules die onze app gebruikt
var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var passport = require('passport'):

var app = express();

app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/signin', passport.authenticate('local'), routes.loginuser);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
