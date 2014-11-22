var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getTracksOfUser = function(req, res) {
	if(!req.user) {
		res.json([{value: false}]);
	} else {
		var id = req.user._id;
		model.Track.find({gebruiker: new ObjectId(id)}, function(err,track) {
			res.json(track);
		});
	}
};

exports.pdfTrack = function(req, res) {
	res.send('een pdf van een track');
};

exports.deleteTrack = function(req, res) {
	//TODO: Het verwijderen van tracks implementeren
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
