/**
 * hierin slaag ik alle tests op
 */

model = require('./model');

/**
 * Dit test een simple post
 */
exports.posttest = function(req, res) {
	var new_naam = req.body.naam,
		new_gebruikersnaam = req.body.gebruikersnaam,
		new_wachtwoord = req.body.wachtwoord,
		new_email = req.body.email;
	var test = new model.Gebruiker({gebruikersnaam: new_gebruikersnaam,
									wachtwoord: new_wachtwoord,
									email: new_email,
									naam: new_naam});
	res.send(test);
};