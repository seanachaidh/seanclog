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

exports.saveTrack = function(req, res) {
	var new_titel = req.body.titel,
		new_begintijd = req.body.begintijd,
		new_eindtijd = req.body.eindtijd,
		new_project = req.body.project,
		new_gebruiker = req.body.gebruiker;
	
	var new_track = new model.Track({
		titel: new_titel,
		begintijd: new_begintijd,
		eindtijd: new_eindtijd,
		project: new ObjectId(new_project),
		gebruiker: new ObjectId(new_gebruiker)
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
