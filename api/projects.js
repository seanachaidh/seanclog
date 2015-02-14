/*
 * De projecten
 */
var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;
var validator = require('validator');

function validateProject(project) {
	if(validator.isFloat(project.prijs) == false) return false;
	if(project.klant == undefined) return false;
	return true;
}

/*
 * Krijg alle projecten van de huidig aangemelde gebruiker
 */
exports.getProjectsOfUser = function(req, res) {
	var token = req.param('access_token');
	
	model.Token.findOne({token: token}, function(err, doc) {
		var id = doc.gebruiker;
		
		var q = model.Project.find({gebruiker: id});
		q.populate('klant');
		
		q.exec(function(err, projects) {
			res.json(projects);
		});
	});
};

exports.updateProject = function(req, res) {
	var id = req.params.id;
	var token = req.query.access_token;
	
	var valid = validateProject({
		prijs: req.body.prijs,
		klant: req.body.klant
	});
	
	if(valid == false) {
		console.log('update project: project is niet geldig');
		res.json({value: false});
		return;
	}
	
	model.checkUser(token, function(retval) {
		var tmpproj = {
			prijs: req.body.prijs,
			klant: req.body.klant._id,
			titel: req.body.titel
		}
		model.Project.update({_id: new ObjectId(id), gebruiker: retval.id}, {$set: tmpproj}, function(err) {
			if(err) {
				console.log(err.message);
				res.json({value: false});
			}
			else
				res.json({value: true});
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
	var id = req.params.id;
	var token = req.query.access_token

	model.checkUser(token, function(retval) {
		model.Project.remove({_id: id, gebruiker: retval.id}, function(err) {
			if(err) {
				console.log(err.message);
				res.json({value: false});
			} else {
				res.json({value: true});
			}
		});
	});


};

exports.saveProject = function(req, res) {
	var curtoken = req.query.access_token;
		new_titel = req.body.titel,
		new_prijs = req.body.prijs,
		new_klant = req.body.klant;
		
	
	if(validateProject(req.body) == false) {
		res.json({value: false});
		return;
	}
	
	console.log("begin van de saveproject functie");
	
	model.Token.findOne({token: curtoken}, function(err, tok) {
		if(err || (tok == null)) {
			console.log('projecten: De token werd niet gevonden');
			res.json({value: false});
		} else {
			new_project = new model.Project({
				titel: new_titel,
				prijs: new_prijs,
				klant: new_klant._id,
				gebruiker: tok.gebruiker
			});
			
			new_project.save(function(err, sav) {
				if(err) {
					console.log('project: bewaren mislukt');
					res.json({value: false});
				} else {
					console.log('project: bewaren gelukt');
					res.json({
						value: true,
						savedId: sav.id
					});
				}
			});
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
