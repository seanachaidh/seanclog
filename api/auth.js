var passport = require('passport');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy

var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

/*
 * Ik moet nog eens stap voor stap bekijken wat deze code allemaal betekent
 */
passport.use(new BearerStrategy({}, function(token, done) {
	/*
	 * Voorlopig zijn de userid's onze tokens
	 */
	model.Gebruiker.findOne({_id: token}, function(err, docs) {
		if(err) {
			return done(err);
		}
		if(!docs) {
			return done(null, false);
		}
		return done(null, docs, {scope: 'all'});
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	model.Gebruiker.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function authUser(username, password, done) {
	var pass = crypto.createHash('md5').update(password).digest('hex');
	model.Gebruiker.findOne({gebruikersnaam: username, wachtwoord: pass}, function(err, user) {
		if(err) {
			return done(err);
		}
		if(!user) {
			done(null, false, {message: 'Gebruiker niet gesvonden'});
		}
		
		//Comment est-ce que je peux evoyer une reponse?
		return done(null, {"token": user.token});
	});
}));
