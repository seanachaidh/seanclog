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
	res.send('nog niet gemaakt');
}
