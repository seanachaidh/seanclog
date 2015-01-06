var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getTracksOfUser = function(req, res) {
	
	//TODO: Deze functie moet volledig herschreven worden want hij werkt niet!
	
	var token = req.param('access_token');
	if(token == "") {
		res.json([{value: false}]);
	} else {
		var id = '';
		var query = model.Gebruiker.findOne({token: token}).select('_id');
		
		query.exec(function(err, value){
			console.log(value._id);
			console.log(value);
			
			if(err) {
				res.json([{value: false}]);
			} else {
				model.Track.find({gebruiker: new ObjectId(value._id)}, function(err,track) {
					res.json(track);
				});
			}
		});
		

	}
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
	//sauvegarde un track
	var new_titel = req.body.titel,
		new_begintijd = req.body.begintijd,
		new_eindtijd = req.body.eindtijd,
		new_project = req.body.project._id,
		new_gebruiker = req.user._id;
	//j' ai seulement besoin de l' Id du project et de l'utilisateur
	
	var new_track = new model.Track({
		titel: new_titel,
		begintijd: new_begintijd,
		eindtijd: new_eindtijd,
		project: new ObjectId(new_project._id),
		gebruiker: new ObjectId(req.user._id)
	});
	
	new_track.save(function(err){
		if (err) {
			console.log('Er was een fout bij het bewaren van een track');
		}
	});
	
}

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
