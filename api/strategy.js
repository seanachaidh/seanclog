var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var model = require('./model');

exports.mainstrategy = new LocalStrategy(authUser);

function authUser(username, password, done) {
	model.Gebruiker.findOne({gebruikersnaam: username, wachtwoord: password}, function(err, user) {
		if(err) {
			return done(err);
		}
		if(!user) {
			done(null, false, {message: 'Gebruiker niet gevonden'});
		}
		
		return done(null, user);
	});
}