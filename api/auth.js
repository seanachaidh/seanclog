var passport = require('passport');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy

var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

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
		
		//Comment est-ce que je peux evoyer une reponse?
		return done(null, user);
	});
}

exports.initpassport = function (app) {
	app.use(passport.initialize());
	app.use(passport.session());
	/*
	 * Ik moet nog eens stap voor stap bekijken wat deze code allemaal betekent
	 */
	app.use(new BearerStrategy(function(token, done) {
		model.Gebruiker.findOne({token: token}, function(err, docs) {
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
	
};

exports.passroute = function(app) {
	passport.use(mainstrategy);
	//est-ce que ce function envoie une reponse?
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
			var retval = {
				success: true,
				gebruikersnaam: username
			};
			res.json(retval);
		}
	});
};

/**
 * De user api. Misschien past dit beter in een aparte module
 */
exports.addUser = function(req, res) {
	/**
	 * Een gebruiker opslaan
	 */
}
