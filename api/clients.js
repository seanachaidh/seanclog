var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;
var validator = require('validator');


function validateClient(client) {
	if(validator.isNumeric(client.telefoonnummer) == false) return false;
	if(validator.isEmail(client.email) == false) return false
	
	return true;
}

exports.getClientsOfUser = function(req, res) {
	var token = req.param('access_token');
	var search = req.query.search;
	
	model.Token.findOne({token: token}, function(err, doc){
		var id = doc.gebruiker;
		var query;
		
		if(search !== undefined) {
			query = model.Klant.find({gebruiker: id, $text:{$search: search}});
		} else {
			query = model.Klant.find({gebruiker: id});
		}
		
		query.exec(function(err, klant){
			if(err) {
				console.log(err.message);
				res.json([{}]);
			} else {
				res.json(klant);
			}
		});
	});
};

exports.pdfClient = function(req, res) {
	res.send('Een pdf van een kant');
};

exports.updateClient = function(req, res) {
	var id = req.params.id;
	var valid = validateClient(req.body);
	var token = req.query.acces_token;
	
	
	if(valid == false) {
		console.log('update client: de klant is niet geldig');
		res.json({value: false});
		return;
	}
	
	model.checkUser(token, function(retval) {
		model.Klant.findByIdAndUpdate(id, {$set: {
			naam: req.body.naam,
			telefoonnummer: req.body.telefoonnummer,
			email: req.body.email,
			gebruiker: req.body.gebruiker
		}}, function(err) {
			if(err) {
				console.log(err.message);
				res.json({value: false});
			} else {
				res.json({value: true});
			}
		});
	});
};

/**
 * Dit verwijdert een klant op het identificatienummer
 * Geeft true terug als het gelukt is en false als het mislukt is
 */
exports.deleteClient = function(req, res) {
	var id = req.params.id;
	var token = req.query.access_token;
	model.checkUser(token, function(retval) {
		model.Klant.findById(id, {gebruiker: retval.id}, function(err, doc) {
			if(err) {
				console.log(err.message);
				res.json({value: false});
			} else {
				doc.remove(function(err) {
					if(err) {
						console.log(err.message);
						res.json({value: false});
					} else {
						res.json({value: true});
					}
				});
			}
		});
	});
};

exports.saveClient = function(req, res) {
	var curtoken = req.query.access_token;
	var new_naam = req.body.naam,
		new_telefoonnummer = req.body.telefoonnummer,
		new_email = req.body.email;
	
	var valid = validateClient(req.body);
	if(valid == false) {
		console.log('save client: client niet geldig');
		res.json({value: false});
		return;
	}
		
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
			
			new_client.save(function(err, sav) {
				if(err) {
					console.log('klanten: de klant kon niet worden bewaard');
					res.json({value: false});
				} else {
					console.log('klanten: De nieuwe klant is met success bewaard');
					res.json({
						value: true,
						savedId: sav.id
					});
				}
			});
		}
	}); 
};
