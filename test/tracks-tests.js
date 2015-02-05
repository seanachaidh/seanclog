var request = require('superagent');
var expect = require('expect.js');
var clogapi = require('../api');
var app = require('../app');

describe('tracksapi', function() {
	var logintoken;
	var testproject;
	var shouldBeDeleted = 0;
	
	before(function(done) {
		//inloggen en testdata in de database stoppen
		request.post('http://localhost:5000/api/login')
		.send({username: 'pieter', password:'ragnarok'})
		.end(function(res) {
			logintoken = res.body.token;
			//Ik weet niet zeker of dit wel een geldig project maakt
			testproject = new clogapi.model.Project({
				titel: "hello world",
				prijs: 10
			});
			done();
		});
	});
	
	after(function() {
		//data verwijderen
	});
	
	it('should save', function(done) {
		request.post('http://localhost:5000/api/tracks')
		.query({access_token: logintoken})
		.send({
			titel: "mocha test track",
			begintijd: new Date(),
			eindtijd: new Date() + 3600000,
			project: testproject
		})
		.end(function(res) {
			console.log(res.body);
			expect(res.body.value).to.be(true);
			shouldBeDeleted = res.body.savedId;
			done();
		});
	});
	
	afterEach(function(done) {
		if(shouldBeDeleted != 0){
			request.del('http://localhost:5000/api/tracks/' + shouldBeDeleted)
			.query({access_token: logintoken})
			.end(function(res) {
				shouldBeDeleted = 0;
				done();
			});
		}
	});
});
