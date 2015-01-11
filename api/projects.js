/*
 * De projecten
 */
var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

/*
 * Krijg alle projecten van de huidig aangemelde gebruiker
 */
exports.getProjectsOfUser = function(req, res) {
	var token = req.param('access_token');
	
	model.Gebruiker.findOne({token: token}, function(err, doc) {
		var id = doc._id;
		
		model.Project.find({gebruiker: id}, function(err, project){
			res.json(project);
		});
	});
};

exports.pdfProject = function(req, res) {
	var retval = {
		names: ["titel", "prijs", "gebruiker"]
	};
	
	var data = new Array();
	var query = model.Project.find().select("titel prijs gebruiker -_id");
	
	query.exec(function(err, docs) {
		
	});
};

exports.deleteProject = function(req, res) {
	/**
	 * dit is gebasseerd op de id van een project
	 * Geeft false terug wanneer het verwijderen niet gelukt is
	 * en true wanneer het wel gelukt is
	 */
	 var id = req.body.project._id;
	 
	 model.Project.remove({_id: id}, function(err) {
		 if(err) {
			 console.log('het verwijderen is niet gelukt');
			 res.json({value: false});
		 } else {
			 console.log('het verwijderen is gelukt');
			 res.json({value: true});
		 }
	 });
};

exports.saveProject = function(req, res) {
	var gebruikerid = req.user._id;
		new_titel = req.body.titel,
		new_prijs = req.body.prijs;
	var new_proj = new model.Project({titel: new_titel, prijs: new_prijs, gebruiker: new ObjectId(gebruikerid)});
	new_proj.save(function(err) {
		if(err) {
			console.log("Er was een fout bij het bewaren van een project");
		} else {
			console.log('het bewaren van het project is goed verlopen (hopelijk)');
		}
	});
};

exports.getProject = function(req, res) {
	if (req.user) {
		var tofind = req.params.projid;
		model.Project.findById(id, function(err, found) {
			if (err) {
				res.send('niet gevonden');
			} else {
				res.send(found);
			}
		});
	} else {
		res.send('niet aangemeld');
	}
};
