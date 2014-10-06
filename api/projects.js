/*
 * De projecten
 */
var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getProjectsOfUser = function(req, res) {
	var id = req.param('userid');
	model.Project.find({gebruiker: new ObjectId(id)}, function(err, docs) {
		res.json(docs);
	});
};