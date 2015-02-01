var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getTracksOfUser = function(req, res) {
	var token = req.param('access_token');
	
	model.Token.findOne({token: token}, function(err, doc) {
		var id = doc.gebruiker;
		
		console.log(doc);
		console.log(id);
		model.Track.find({gebruiker: id}, function(err, tr) {
			res.json(tr);
		});
		
	});
	
};

exports.updateTrack = function(req, res) {
	var id = req.params.id;
	
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
		track.project = new_project;
		
		track.save(function(err) {
			if(err)
				res.json({value: false});
			else
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
	var id = req.body.track._id;
	
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
		
		new_track.save(function(err) {
			if(err) {
				res.json({value: false});
			} else {
				res.json({value: true});
			}
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
