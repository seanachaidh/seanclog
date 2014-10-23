var model = require('./model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getClientsOfUser = function(req, res) {
	if(!req.user) {
		res.json([{value:false}]);
	} else {
		var id = req.user._id;
		model.Klant.find({gebruiker: new ObjectId(id)}, function(err, k) {
			res.json(k);
		});
	}
}