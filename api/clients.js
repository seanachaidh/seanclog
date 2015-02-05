var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;
var validator = require('validator');


function validateClient(client) {
	if(validator.isNummeric(client.telefoonnummer) == false) return false;
	if(validator.isEmail(client.email) == false) return false
	
	return true;
}

exports.getClientsOfUser = function(req, res) {
	var token = req.param('access_token');
	
	model.Token.findOne({token: token}, function(err, doc){
		var id = doc.gebruiker;
		
		model.Klant.find({gebruiker: id}, function(err, klant){
			res.json(klant);
		});
	});
};

exports.pdfClient = function(req, res) {
	res.send('Een pdf van een kant');
};

exports.updateClient = function(req, res) {
	var id = req.params.id;
	
	model.Klant.findById(id, function(err, klant) {
		klant.naam = req.body.naam;
		klant.telefoonnummer = req.body.telefoonnummer;
		klant.email = req.body.email;
		klant.gebruiker = req.body.gebruiker;
		
		klant.save(function(err) {
			if(err) {
				res.json({value: false});
			}
			res.json({value: true});
		});
	});
};

/**
 * Dit verwijdert een klant op het identificatienummer
 * Geeft true terug als het gelukt is en false als het mislukt is
 */
exports.deleteClient = function(req, res) {
	var id = req.params.id;
	model.Klant.remove({_id: new ObjectId(id)}, function(err) {
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
	var curtoken = req.query.access_token;
	var new_naam = req.body.naam,
		new_telefoonnummer = req.body.telefoonnummer,
		new_email = req.body.email;
		
	model.Token.findOne({token: curtoken}, function(err, g) {
		if(err) {
			console.log('klanten: De gebruiker werd niet gevonden');
			res.json({value: false});
		} else {
			var new_client = new model.Klant({
				naam: new_naam,
				telefoonnummer: new_telefoonnummer,
				email: new_email,
				gebruiker: g.gebruiker
			});
			new_client.save(function(err) {
				if(err) {
					console.log('klanten: de klant kon niet worden bewaard');
					res.json({value: false});
				} else {
					console.log('klanten: De nieuwe klant is met success bewaard');
					res.json({value: true});
				}
			});
		}
	}); 
};
