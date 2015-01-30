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
		retval += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return retval;
}

/*
 * Ik moet nog eens stap voor stap bekijken wat deze code allemaal betekent
 */
passport.use(new BearerStrategy({}, function(token, done) {
	model.Token.findOne({token: token}, function(err, t) {
		if(err) {
			return done(err);
		}
		if(!t) {
			return done(null, false);
		}
		return done(null, t, {scope: 'all'});
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

/*
 * De gebruiker ophalen
 * Kijken of er nog een token aanwezig is
 * Een nieuwe token maken indien dit niet het geval is
 * Deze token terugsturen
 */
passport.use(new LocalStrategy(function authUser(username, password, done) {
	var pass = crypto.createHash('md5').update(password).digest('hex');
	
	model.Gebruiker.findOne({gebruikersnaam: username, wachtwoord: pass}, function(err, user) {
		if(err) {
			return done(err);
		}
		if(!user) {
			return done(null, false, {message: 'Gebruiker niet gesvonden'});
		}
		
		model.Token.findOne({gebruiker: user._id}, function(err, tok) {
			if(!tok) {
				/*
				 * Geen token gevonden. Nieuwe token maken.
				 */
				 var tmp = generateToken(10);
				 var new_token = new model.Token({
					 token: tmp,
					 made: Date.now(),
					 gebruiker: user._id
				 });
				 new_token.save(function(err) {
					 return done(null, new_token);
				 });
				 
			 } else {
				 /*
				  * Token gevonden.
				  * Kijken of deze nog niet vervallen is
				  */
				  //Seconden in een week = 604800
				  if((Date.now() - tok.made.getTime()) > 604800) {
					  tok.remove(function(err) {
						  //token vervallen. Nieuwe token maken
						  var tmp = generateToken(10);
						  var new_token = new model.Token({
							  token: tmp,
							  made: Date.now(),
							  gebruiker: user._id
						  });
						  
						  new_token.save(function(err) {
							  return done(null, new_token);
						  });
					  });
				  } else {
					  //Alles in orde
					  return done(null, tok);
				  }
			  }
		});
		//return done(null, user);
	});
}));

/*
 * Deze functie maakt een nieuwe gebruiker aan en
 * maakt een token aan voor deze gebruiker. Daarna
 * wordt er een bevestigingsmail gestuur naar de gebruiker
 */
exports.createUser = function(req, res) {
	var new_gebruikersnaam = req.body.gebruikersnaam,
		new_naam = req.body.naam,
		new_email = req.body.email,
		new_password = crypto.createHash('md5').update(req.body.wachtwoord).digest('hex');
	var new_token = generateToken(10);
	
	var tmp =  new model.Gebruiker({
		gebruikersnaam: new_gebruikersnaam,
		naam: new_naam,
		email: new_email,
		wachtwoord: new_password,
		token: new_token
	});
	tmp.save(function(err) {
		if(err) {
			console.log("Er was een error bij het maken van een gebruiker");
			res.json({value: false});
		} else {
			console.log("maken van de gebruiker gelukt!");
			res.json({value: true});
		}
	});
	
};

/*
 * Deze methode werkt voorlopig nog niet
 * Ik moet kijken hoe ik deze methode werkend krijg.
 */
exports.performLogout = function(req, res) {
	
	var oldtoken = req.query.access_token;
	console.log(oldtoken);
	var newtoken = generateToken(10);
	
	/*
	 * Om een of andere reden werkt deze update niet
	 */
	 
	 model.Gebruiker.update({token: oldtoken}, {$set: {token: newtoken}}, function(err) {
		 if(err) {
			 res.json({value: false});
		 } else {
			 res.json({value: true});
		 }
	 });
};
