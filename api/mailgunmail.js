var request = require('superagent');
var os = require('os');

var url = 'http://127.0.0.1:' + (process.env.PORT || '5000');

function MailgunMail(user) {
	to = user.email;
	from = 'Excited User <pvankeymeulen@seanachaidh.be>';
	subject = 'Seanclog validation mail';
	text = "dear user\n" +
				"Please validate your account\n" +
				url + "/api/validateuser/" + user._id;
				
	this.sendMail = function() {
		console.log(from);
		console.log(to);
		console.log(subject);
		console.log(text);
			
		var mailobj = {
			from: from,
			to: to,
			subject: subject,
			text: text
		}
		
		request.post('https://api.mailgun.net/v2/sandbox6fd51d0145754e90b24d3ec0fbbaac2e.mailgun.org/messages')
		.auth('api', 'key-a39bbd94c3832b05c42f6385f396c31e')
		.send(mailobj)
		.end(function(err, res) {
			if(err) {
				console.log('Er was een error bij het versturen van een mail');
				if(typeof next === 'function') next();
			} else {
				if(res.body.message == "Queued. Thank you.") {
					console.log('mailgun mail verstuurd');
				} else {
					console.log(res.body.message);
				}
				if(typeof next === 'function') next();
			}
		});
		//~ console.log(from);
		//~ console.log(subject);
	}
}
module.exports = MailgunMail;
