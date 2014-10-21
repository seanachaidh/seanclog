exports.tracks = require('./tracks');
exports.projects = require('./projects');
exports.tests = require('./tests');
exports.auth = require('./auth');

/* Enkele basisfuncties */
//exports.getCurrentUser = function(req, res) {
//	if(req.user) {
//		res.send(req.user);
//	} else {
//		res.send('not logged in');
//	}
//}

exports.retrieveFromSession = function(req, res) {
	if(req.params.varname == "user") {
		if(req.user) {
			res.send(req.user);
		} else {
			res.send('Er is niemand aangelogd');
		}
	} else {
		var vartofind = req.params.varname;
		res.send(req.session[vartofind]);
	}
};

exports.saveToSession = function(req, res) {
	req.session[req.params.varname] = varvalue
};
