exports.tracks = require('./tracks');
exports.projects = require('./projects');
exports.tests = require('./tests');
exports.auth = require('./auth');

/*
 * enkele nuttige hulpfuncties
 */

/*
 * Verkrijg de gebruiker die op dit moment aangemeld is
 */
exports.getCurrentUser = function(req, res) {
	if(!req.user) {
		res.send({value: false});
	} else {
		req.send(req.user);
	}
}
