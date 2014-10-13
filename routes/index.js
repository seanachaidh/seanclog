
exports.index = function(req, res) {
	res.render('login', {});
};

exports.app = function(req, res) {
	res.render('index', {});
};