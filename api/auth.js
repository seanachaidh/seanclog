var passport = require('passport');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;

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
	app.post('/login', passport.authenticate('local'), function(res, req) {
		//Cette function est appelé si le authentication est une success
		var username = req.user.gebruikersnaam;
		var retval = {
			value: username,
			success: true
		};
		//TODO: Ik heb hier het probleem dat er hier eigenlijk een redirectie moet gebeuren
		/*
		 * Een mogelijke oplossing is om deze waarde in angular op te vangen
		 * en dan een redirectie uit te voeren
		 */
		res.send(retval);
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