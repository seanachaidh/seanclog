/**
 * in dit bestand worden alle diensten getest
 */

var Session;

describe('Diensten dienen getest te worden', function() {
	beforeEach(function() {
		browser.get('http://localhost:5000');
	});
	inject(function($injector) {
		Session = $injector.get('Session');
	});
	
	it('Current user should return', function(){
		//Test getting the current user
	});
	
});