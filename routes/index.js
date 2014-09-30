
exports.index = function(req, res) {
	res.render('index', {});
};

exports.loginuser = function(req, res) {
	//als we in deze functie zitten hebben we req.user
	//res.redirect('/users/' + req.user.username);
};