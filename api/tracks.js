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
	
	if(track.project === undefined) {
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
	var search = req.query.search;
	
	model.Token.findOne({token: token}, function(err, tok) {
		var id = tok.gebruiker;
		var q;
		
		if(search !== undefined) {
			q = model.Track.find({gebruiker: id, $text:{$search: search}});
		} else {
			q = model.Track.find({gebruiker: id});
		}
		q.populate('project');
		
		q.exec(function(err, tracks) {
			if(err) {
				console.log(err.message);
				res.json([{}]);
			} else {
				res.json(tracks);
			}
		});
	});
};

exports.updateTrack = function(req, res) {
	var id = req.params.id;
	var token = req.query.access_token;
	
	var valid = validateTrack({
		begintijd: req.body.begintijd,
		eindtijd: req.body.eindtijd,
		project: req.body.project
	});
	
	if(valid == false) {
		res.json({value: false});
	}
	
	model.checkUser(token, function(retval) {
		model.Track.findById(id, {gebruiker: retval.id}, function(err, track) {
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
	var token = req.query.access_token;
	model.checkUser(token, function(retval) {
		model.Track.findById(id, {gebruiker: retval.id}, function(err, doc) {
			if(err) {
				console.log('De track is niet verwijderd');
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
	

}
exports.saveTrack = function(req, res) {
	var token = req.query.access_token;
	model.Token.findOne({token: token}, function(err, tok) {
		if(err || (tok == null)) {
			console.log('token is niet geldig');
			res.json({value: false });
		}
		
		if(validateTrack(req.body) == false) {
			res.json({value: false});
			return;
		}
		
		var new_track = new model.Track({
			titel: req.body.titel,
			begintijd: req.body.begintijd,
			eindtijd: req.body.eindtijd,
			project: req.body.project._id,
			gebruiker: tok.gebruiker
		});
		
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
