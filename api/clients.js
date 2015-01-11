var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getClientsOfUser = function(req, res) {
	var token = req.param('access_token');
	
	model.Gebruiker.findOne({token: token}, function(err, doc){
		var id = doc._id;
		
		model.Klant.find({gebruiker: id}, function(err, klant){
			res.json(klant);
		});
	});
};

exports.pdfClient = function(req, res) {
	res.send('Een pdf van een kant');
};

/**
 * Dit verwijdert een klant op het identificatienummer
 * Geeft true terug als het gelukt is en false als het mislukt is
 */
exports.deleteClient = function(req, res) {
	var id = req.body.client._id;
	Klant.remove({_id: new ObjectId(id)}, function(err) {
		if(err){
			console.log('het verwijderen is niet gelukt');
			res.json({value: false});
		} else {
			console.log('het verwijderen van een klant is gelukt');
			res.json({value: true});
		}
	});
};

exports.saveClient = function(req, res) {
	var new_naam = req.body.naam,
		new_telefoonnummer = req.body.telefoonnummer,
		new_email = req.body.email,
		new_gebruiker = req.body.gebruiker;
	var new_client = new model.Klant({
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
