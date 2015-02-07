/*
 * http://ericpanorel.net/2013/10/05/angularjs-password-match-form-validation/
 */
var seanclogSecurity = angular.module('SeanclogSecurity', []);

seanclogSecurity.directive('ngMatch', ['$parse', function($parse) {
	//ngmatch directive
	
	function link(scope, elem, attrs, ctrl) {
		if(!ctrl) return;
		if(!attrs['ngMatch']) return;
		
		var firstPassword = $parse(attrs['ngMatch']);
		
		var validator = function(value) {
			var temp = firstPassword(scope);
			var v = (value === temp);
			ctrl.$setValidity('match', v);
			return value;
		};
		
		ctrl.$parsers.unshift(validator);
		ctrl.$formatters.push(validator);
		attrs.$observe('ngMatch', function() {
			validator(ctrl.$viewValue);
		});
	}
	
	return {
		link: link,
		restrict: 'A',
		require: '?ngModel'
	};
}]);
