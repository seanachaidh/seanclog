module.exports = function(config) {
	config.set({
		frameworks:['jasmine'],
		files: [
			"*.js",
			"public/javascripts/*.js",
			"tests/*.js"
		]
	});
};
