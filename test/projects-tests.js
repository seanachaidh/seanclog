var request = require('superagent');
var expect = require('expect.js');
var app = require('../app');
var api = require('../api');

describe('projectsapi', function() {
	var logintoken;
	var toBeDeleted = 0;
	var tmpclient;
	
	
	before(function(done) {
		request.post('http://localhost:5000/api/login')
		.send({username: 'pieter', password: '12345'})
		.end(function(res) {
			logintoken = res.body.token;
			
			tmpclient = new api.model.Klant({
				naam: "mocha test klant",
				telefoonnummer: '7522552',
				email: 'ldkfjsqlkf@oqdfjlqdkfj.com'
			});
			
			done();
		});
	});
	
	afterEach(function(done) {
		if(toBeDeleted != 0) {
			request.del('http://localhost:5000/api/projects/' + toBeDeleted)
			.query({access_token: logintoken})
			.end(function(res) {
				toBeDeleted = 0;
				done()
			});
		} else {
			done();
		}
	});
	
	/*
	 * tests voor de projects api
	 */
	it('should save', function(done) {
		var tmpproj = new api.model.Project({
			titel: 'mocha test project',
			prijs: 12.50,
			klant: tmpclient
		});
		request.post('http://localhost:5000/api/projects')
		.query({access_token: logintoken})
		.send(tmpproj)
		.end(function(res) {
			expect(res.body.value).to.be(true);
			toBeDeleted = res.body.savedId;
			done();
		});
	});
	
	it('should not crash with empty project', function(done) {
		var tmpproj = new model.Project({});
		request.post('http://localhost:5000/api/projects')
		.query({access_token: logintoken})
		.send(tmpproj)
		.end(function(res) {
			expect(res.body.value).to.be(false);
			done();
		});
	});
});


