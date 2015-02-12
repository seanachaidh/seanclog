//~ var app = require('../app');
var os = require('os');

var url = 'http://127.0.0.1:' + (process.env.PORT || '5000');
var mailgunurl = "https://api:key-a39bbd94c3832b05c42f6385f396c31e" +
				"@api.mailgun.net/v2/sandbox6fd51d0145754e90b24d3ec0fbbaac2e.mailgun.org/messages"

debugger;
var MailgunMail = function(user) {
	this.to = user.email;
	this.apikey = 'key-a39bbd94c3832b05c42f6385f396c31e';
	this.from = 'Excited User <pvankeymeulen@seanachaidh.be>';
	this.subject = 'Seanclog validation mail';
	this.text = "dear user\n" +
				"Please validate your account\n" +
				url + "/api/validateuser/" + user._id;
};

MailgunMail.prototype.sendMail = function() {
	throw Error('nog niet gemaakt');
}
