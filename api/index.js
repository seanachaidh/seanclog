exports.tracks = require('./tracks');
exports.projects = require('./projects');
exports.tests = require('./tests');
exports.auth = require('./auth');

/* Enkele basisfuncties */
exports.getCurrentUser = function(req, res) {
	if(req.user) {
		res.send(req.user);
	} else {
		res.send('not logged in');
	}
}