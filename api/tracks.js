var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

	var validator = require('validator');

function validateTrack(track) {
	if(validator.isDate(track.begintijd) == false) {
		console.log('begintijd:' + track.begintijd);
		return false;
	}
	if(validator.isDate(track.eindtijd) == false){
		console.log('eindtijd:' + track.eindtijd);
		return false;
	}
	//Dit geeft altijd onwaar terug. Ook al klopt de waarde van project
	//~ if(validator.isJSON(track.project) == false) {
		//~ return false;
	//~ }
	
	return true;
}

exports.getTracksOfUser = function(req, res) {
	var token = req.param('access_token');
	//Deze variable wordt voorlopig nog niet weet hoe ik dit kan afdwingen
	var includeprojects = req.param('include_projects');
	model.Token.findOne({token: token}, function(err, tok) {
		var q = model.Track.find({gebruiker: tok.gebruiker});
		q.populate('project');
		
		q.exec(function(err, proj) {
			res.json(proj);
		});
	});
};

exports.updateTrack = function(req, res) {
	var id = req.params.id;
	
	var valid = validateTrack({
		begintijd: req.body.begintijd,
		eindtijd: req.body.eindtijd,
		project: req.body.project
	});
	
	if(valid == false) {
		res.json({value: false});
	}
	
	model.Track.findById(id, function(err, track) {
		var new_begin = req.body.begintijd;
		var new_end = req.body.eindtijd;
		var new_titel = req.body.titel;
		//Is dit een objectid of een string?
		var new_project = req.body.project;
		
		track.titel = new_titel;
		track.begintijd = new_begin
		track.eindtijd = new_end;
		//hier gaan we ervan uit dat het een objectid is
		track.project = new_project._id;
		
		track.save(function(err) {
			if(err){
				res.json({value: false});
			}
			res.json({value: true});
		});
	});
};

exports.pdfTrack = function(req, res) {
	res.send('een pdf van een track');
};

/**
 * Dit verwijdert een track op basis van het identificatienummer
 * Geeft waar terug als de verwijdering gelukt is
 * Vals als de verwijdering niet gelukt is
 */
exports.deleteTrack = function(req, res) {
	var id = req.params.id;
	
	model.Track.remove({_id: id}, function(err) {
		if(err) {
			console.log('De track is niet verwijderd');
			res.json({value: false});
		} else {
			console.log('De track is verwijderd');
			res.json({value: true});
		}
	});
}
exports.saveTrack = function(req, res) {
	var token = req.query.access_token;
	model.Token.findOne({token: token}, function(err, tok) {
		if(err || (tok == null)) {
			console.log('token is niet geldig');
			res.json({value: false });
		}
		
		var new_track = new model.Track({
			titel: req.body.titel,
			begintijd: req.body.begintijd,
			eindtijd: req.body.eindtijd,
			project: req.body.project._id,
			gebruiker: tok.gebruiker
		});
		
		if(validateTrack(new_track) == false) {
			res.json({value: false});
		}
		
		new_track.save(function(err, sav) {
			if(err) {
				res.json({value: false});
			}
			res.json({
				value: true,
				savedId: sav.id
			});
		});
	});	
};

//TODO: Deze track moet nog herschreven worden
exports.getTrack = function(req, res){
	if(req.user){
		var tofind = req.params.clientid;
		model.Track.findById(tofind, function(err, found){
			if(err){
				res.send('niets gevonden');
			} else {
				res.send(found);
			}
		});
	} else {
		res.send('niet aangemeld');
	}
}
