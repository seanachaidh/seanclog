var model = require('./model');
var mongoose = require('mongoose');

exports.getTracksOfUser = function(req, res) {
	var id = req.param('userid');
	var projects = req.db.get('projects');
	projects.find({gebruiker: projects.id(id)}, function(err, doc) {
		if(!err) {
			res.send(doc);
		} else {
			res.send('niets gevonden');
		}
	});
};