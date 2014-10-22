/*
 * De projecten
 */
var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

/*
 * Krijg alle projecten van de huidig aangemelde gebruiker
 */
exports.getProjectsOfUser = function(req, res) {
	if(!req.user) {
		res.json([{value:false}]);
	} else {
		// vergeet de api en gebruik hier direct de gewone sessie
		var id = req.user._id;
		model.Project.find({
			gebruiker : new ObjectId(id)
		}, function(err, docs) {
			res.json(docs);
		});
	}

};