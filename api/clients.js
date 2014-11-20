var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getClientsOfUser = function(req, res) {
	if(!req.user) {
		res.json([{value:false}]);
	} else {
		var id = req.user._id;
		model.Klant.find({gebruiker: new ObjectId(id)}, function(err, k) {
			res.json(k);
		});
	}
}

exports.deleteClient = function(req, res) {
	//TODO: Het verwijderen van klanten implementeren
}

exports.saveClient = function(req, res) {
	var new_naam = req.body.naam,
		new_telefoonnummer = req.body.telefoonnummer,
		new_email = req.body.email,
		new_gebruiker = req.body.gebruiker;
	var new_cient = new model.Klant({
		naam: new_naam,
		telefoonnummer: new_telefoonnummer,
		email: new_email,
		gebruiker: new ObjectId(new_gebruiker)
	});
	
	new_client.save(function(err){
		if(err){
			console.log('Het bewaren van een klant is niet gelukt');
		} else {
			console.log('De klant is successvol bewaard');
		}
	});
}
