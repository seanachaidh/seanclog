/*
 * Hier bevindt zich de API voor het exporteren van tabellen naar een pdf
 */

/*
 * we hebben phantom nodig om webpagina's te exporteren naar pdf
 */

var phantom = require('phantom');
var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getClients = function(req, res) {
	//We gaan niets verzenden als er geen gebruiker is aangemeld
	if(!req.user){
		res.json({value: false});
	} else {
		//Deze variabele gaan we gebruiken in onze queries.
		var g = new ObjectId(req.user._id);
		model.Klant.find({gebruiker: g}, function(err, f) {
			if(err) {
				res.send({value: false});
			} else {
				res.render("pdf", {tabel: f});
			}
		});
	}
};

exports.getProjects = function(req, res) {
	if(!req.user) {
		res.json({value: false});
	} else {
		var g = new ObjectId(req.user._id);
		model.Project.find({gebruiker: g}, function(err, f){
			if(err) {
				res.json({value: false});
			} else {
				res.render("pdf", {tabel: f});
			}
		});
	}
};

exports.getTracks = function(req, res) {
	if(!req.user) {
		res.json({value: false});
	} else {
		var g = new ObjectId(req.user._id);
		model.Track.find({gebruiker: g}, function(err, f) {
			if(err) {
				res.json({value: false});
			} else {
				res.render("pdf", {tabel: f});
			}
		});
	}
};
