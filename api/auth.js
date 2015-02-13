var passport = require('passport');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy

var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

/*
 * Ik heb deze code van stack overflow
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
		
		if(user.validated == false) {
			return done(null, false, {message: 'Gebruiker is nog niet gevalideerd'});
		}
		
		model.Token.findOne({gebruiker: user._id}, function(err, tok) {
			if(!tok) {
				/*
				 * Geen token gevonden. Nieuwe token maken.
				 */
				 console.log('nieuwe token maken voor: ' + user.naam);
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
				  if((Date.now() - tok.made.getTime()) > 604800000) {
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
	
	/*
	 * TODO: implement validation skip secret
	 */
	var tmp =  new model.Gebruiker({
		gebruikersnaam: new_gebruikersnaam,
		naam: new_naam,
		email: new_email,
		wachtwoord: new_password
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

exports.updateUser = function(req, res) {
	var token = req.query.access_token;
	model.Token.findOne({token: token}, function(err, retval) {
		if(!retval) {
			console.log('updateUser: geen geldige token meegekregen');
			res.json({value: false});
		}
		
		model.Gebruiker.findById(retval._id, function(err, retval) {
			if(!retval) {
				console.log('updateUser: Token niet verbonden aan bestaande gebruiker');
				res.json({value: false});
			}
			if(req.body.wachtwoord !== undefined) {
				var tmppass = crypto.createHash("md5").update(req.body.wachtwoord).digest("hex");
				retval.wachtwoord = tmppass;
			}
			
			if(req.body.naam !== undefined) {
				retval.naam = req.body.naam;
			}
			
			if(req.body.gebruikersnaam !== undefined) {
				retval.gebruikersnaam = req.body.gebruikersnaam;
			}
			
			if(req.body.email !== undefined) {
				retval.email = req.body.email;
			}
			
			retval.save(function(err) {
				if(err) {
					console.log('updateUser: Bewaren van gebruiker is niet gelukt');
					res.json({value: false});
				}
				res.json({value: true});
			});
		});
				
	});
};

exports.removeUser = function(req, res) {
	var token = req.query.access_token;
	
	//eerst kijken of de gebruiker bestaat
	model.Token.findOne({token: token}, function(err, retval) {
		if(!retval) {
			console.log('removeUser: token is ongeldig');
			res.json({value: false});
		}
		//vreemde constructie
		model.Gebruiker.remove({_id: retval.gebruiker}, function(err) {
			if(err) {
				res.json({value: false});
				throw(err);
			} else {
				res.json({value: true});
			}
		});
		
	});
};

exports.getUser = function(req, res) {
	var token = req.query.access_token;
	
	model.Token.findOne({token: token}, function(err, tok) {
		if(err) {
			console.log('getUser: ongeldige token');
			res.json({value: false});
			return;
		}
		model.Gebruiker.findById(tok.gebruiker).select('naam email').exec(function(err, gebr) {
			if(err) {
				console.log('getUser: er was een fout');
				res.json({value: false});
				return;
			}
			if(!gebr) {
				console.log('getUser: de gebruiker is niet opgehaald');
				res.json({value: false});
				return;
			}
			
			res.json(gebr);
		});
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

exports.validateuser = function(req, res) {
	var id = req.params.id;
	model.Gebruiker.findById(id, function(err, gebr) {
		if(err) {
			console.log('Er was een fout');
			res.json({value: false});
			return;
		}
		if(!gebr) {
			console.log('De gebruiker werd niet gevonden');
			res.json({value: false});
			return;
		}
		gebr.validated = true;
		gebr.save(function(err) {
			if(err) {
				console.log('validateuser: er was een fout bij het bewaren');
				res.json({value: false});
				return;
			}
			/*
			 * Gebruiker werd met success gevalideerd
			 */
			res.redirect('/');
		});
	});
};
