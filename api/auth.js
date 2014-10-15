var passport = require('passport');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var model = require('./model');

var mainstrategy = new LocalStrategy(authUser);



function authUser(username, password, done) {
	var pass = crypto.createHash('md5').update(password).digest('hex');
	model.Gebruiker.findOne({gebruikersnaam: username, wachtwoord: pass}, function(err, user) {
		if(err) {
			return done(err);
		}
		if(!user) {
			done(null, false, {message: 'Gebruiker niet gesvonden'});
		}
		
		return done(null, user);
	});
}

exports.initpassport = function (app) {
	app.use(passport.initialize());
	app.use(passport.session());
	
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});
	
	passport.deserializeUser(function(id, done) {
		model.Gebruiker.findById(id, function(err, user) {
			done(err, user);
		});
	});
	
};

exports.passroute = function(app) {
	app.post('/login', passport.authenticate('local', {
		successRedirect: '/app',
		failureRedirect: '/login'
	}));

	passport.use(mainstrategy);
};
