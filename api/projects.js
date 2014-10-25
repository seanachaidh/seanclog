/*
 * De projecten
 */
var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

/*
 * Krijg alle projecten van de huidig aangemelde gebruiker
 */
exports.getProjectsOfUser = function(req, res) {
	if(!req.user) {
		res.json([{value:false}]);
	} else {
		// vergeet de api en gebruik hier direct de gewone sessie
		var id = req.user._id;
		model.Project.find({
			gebruiker : new ObjectId(id)
		}, function(err, docs) {
			res.json(docs);
		});
	}

};

exports.saveProject = function(req, res) {
	var gebruikerid = req.body.userid,
		new_titel = req.body.titel,
		new_prijs = req.body.prijs;
	var new_proj = new model.Project({titel: new_titel, prijs: new_prijs, gebruiker: new ObjectId(gebruikerid)});
	new_proj.save(function(err) {
		if(err) {
			console.log("Er was een fout bij het bewaren van een project");
		}
	});
}

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
}
