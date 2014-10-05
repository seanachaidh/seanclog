/*
 * De projecten
 */
var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getProjectsOfUser = function(req, res) {
	var id = req.param('userid');
	model.Gebruiker.findById(id, '', {lean:true}, function(err, docs) {
		model.Project.find({gebruiker: docs._id}, function(err, projs){
			res.json(projs);
		});
	});
};