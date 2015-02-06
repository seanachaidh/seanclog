var request = require('superagent');
var expect = require('expect.js');
var app = require('../app');
var api = require('../api');

describe('tests voor klanten', function() {
	var logintoken;
	var toBeDeleted = 0;
	
	before(function(done) {
		request.post('http://localhost:5000/api/login')
		.send({username: 'pieter', password: '12345'})
		.end(function(res) {
			logintoken = res.body.token;
			done();
		});
	});
	
	afterEach(function(done) {
		if(toBeDeleted != 0) {
			request.del('http://localhost:5000/api/clients/' + toBeDeleted)
			.query({access_token: logintoken})
			.end(function(res) {
				toBeDeleted = 0;
				done();
			});
		}
	});
	
	it('should save', function(done) {
		var tmpclient = new api.model.Klant({
			naam: 'mocha testklant',
			telefoonnummer: '252055200',
			email: 'blah@bli.com'
		});
		request.post('http://localhost:5000/api/clients')
		.query({access_token: logintoken})
		.send(tmpclient)
		.end(function(res) {
			expect(res.body.value).to.be(true);
			toBeDeleted = res.body.savedId;
			done();
		});
	});
});
