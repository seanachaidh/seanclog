var request = require('superagent');
var expect = require('expect.js');
var clogapi = require('../api');
var app = require('../app');



describe('usertests', function() {
	var toBeDeleted = 0;
	var curtoken = 0;
	
	var tmpuser = new model.Gebruiker({
		naam: 'mocha testgebruiker',
		wachtwoord: 'test',
		email: 'test@mocha.be',
		gebruikersnaam: 'testmocha',
		validated: true
	});
	
	function createUser(user, callback) {
		request.post('http://localhost:5000/api/users')
		.send(user)
		.end(function(res) {
			if(typeof callback === 'function') {
				callback();
			}
		});
	}
	
	function deleteUser(user, done) {
		request.post('http://localhost:5000/api/login')
		.send({username: user.gebruikersnaam, password: user.wachtwoord})
		.end(function(res) {
			var token = res.body.token;
			request.del('http://localhost:5000/api/users')
			.query({access_token: token})
			.end(function(res) {
				done();
			});
		});
	}
	
	it('should get a user', function(done) {
		function actualTest() {
			request.post("http://localhost:5000/api/login")
			.send({username: tmpuser.gebruikersnaam, password: tmpuser.wachtwoord})
			.end(function(res) {
				request.get("http://localhost:5000/api/users")
				.query({access_token: res.body.token})
				.end(function(res) {
					expect(res.body.naam).to.be("mocha testgebruiker");
					deleteUser(res, done);
				});
			});
		}
		
		createUser(tmpuser, actualTest);
	});
	
	it('should create a user', function(done) {
		request.post('http://localhost:5000/api/users')
		.send(tmpuser)
		.end(function(result) {
			expect(result.body.value).to.be(true);
			deleteUser(tmpuser, done);
		});
	});
	
	it('should delete a user', function(done) {
		function actualTest() {
			request.post('http://localhost:5000/api/login')
			.send({username: tmpuser.gebruikersnaam, password: tmpuser.wachtwoord})
			.end(function(res) {
				var token = res.body.token;
				request.del('http://localhost:5000/api/users')
				.query({access_token: token})
				.end(function(res) {
					expect(res.body.value).to.be(true);
					done();
				});
			});
		}
		createUser(tmpuser, actualTest);
		
	});
	
	it('should update a user', function(done) {
		expect().fail('test nog niet gemaakt');
	});
	
	it('should check a user', function(done) {
		function actualTest() {
			request.post('http://localhost:5000/api/login')
			.send({username: 'testmocha', password: 'test'})
			.end(function(res) {
				var token = res.body.token;
				model.checkUser(token, function(retval) {
					expect(retval.value).to.be(true);
					deleteUser(tmpuser, done);
				});
			});
		}
		
		createUser(tmpuser, actualTest)
	});
	
	/*
	 * Waarop slaat deze test?
	 */
	//~ it('should validate a user', function(done) {
		//~ function actualTest() {
			//~ request.post
		//~ }
		//~ 
		//~ createUser(actualTest);
	//~ });
	
	//~ after(function(done) {
		//~ if((toBeDeleted != 0) && (curtoken != 0)) {
			//~ request.del('http://localhost:5000/api/users/' + toBeDeleted)
			//~ .query({access_token: curtoken})
			//~ .end(function(res) {
				//~ curtoken = 0;
				//~ toBeDeleted = 0;
				//~ done();
			//~ });
		//~ }
	//~ });
});
