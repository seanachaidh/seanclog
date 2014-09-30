/*
 * De projecten
 */
var model = require('./model');
var mongoose = require('mongoose');

exports.getProjectsOfUser = function(req, res) {
	var id = req.param('userid');
	model.Project.find({gebruiker: mongoose.Schema.Types.ObjectId(id)}, {}, function(err, docs) {
		res.send('projects', docs);
	});
};