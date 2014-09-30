var model = require('./model');
var mongoose = require('mongoose');

exports.getTracksOfUser = function(req, res) {
	var id = req.param('userid');
	model.Track.find({gebruiker: mongoose.Schema.Types.ObjectId(id)}, {}, function(err, doc) {
		res.send("tracks", doc);
	});
};