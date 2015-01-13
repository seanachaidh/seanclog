var passport = require('passport');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy

var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

/*
 * TODO: Ik moet deze functie verplaatsen zodat ik ze globaal
 * kan gebruiken. Ik heb deze code van stack overflow
 */
function generateToken(length) {
	var retval = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
	
	for(var i = 0; i < length; i++) {
		retval += possible.charAt(Math.floor(math.random() * possible.length));
	}
	return retval;
}

/*
 * Ik moet nog eens stap voor stap bekijken wat deze code allemaal betekent
 */
passport.use(new BearerStrategy({}, function(token, done) {
	/*
	 * Voorlopig zijn de userid's onze tokens
	 */
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
	done(null, user.token);
});

passport.deserializeUser(function(id, done) {
	model.Gebruiker.find({token: id}, function(err, user) {
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
		return done(null, user);
	});
}));

/*
 * Deze methode werkt voorlopig nog niet
 * Ik moet kijken hoe ik deze methode werkend krijg.
 */
exports.performLogout = function(res, req) {
	var token = req.query.access_token
	model.Gebruiker.find({}, function(err, docs){
		if(err) {
			console.log("er was een fout tijdens het uitloggen");
			res.json({value: false});
		} else {
			
			var breakloop = false;
			var newtoken = "";
			while(!breakloop) {
				var breakloop = true;
				newtoken = generateToken(10);
				for(var i = 0; i < docs.length; i++) {
					obj = docs[i];
					if(obj.token == newtoken) {
						breakloop = false;
					}
				}
			}
			
			//hier hebben we ons nieuwe token
			model.Gebruiker.findOneAndUpdate({token: token}, {$set: {token: newtoken}});
			
		}
	});
};
