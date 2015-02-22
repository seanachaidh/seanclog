/**
 * De modellen voor onze applicatie
 */

var mongoose = require('mongoose');
var mailgunmail = require('./mailgunmail');

/*
 * mailgun
 */
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-a39bbd94c3832b05c42f6385f396c31e');

//de text die op dit moment geparsed is
var ctext = '';
var fs = require('fs');

//gegevens om te connecteren
var pass = '',
	host = '',
	user = '',
	db = '',
	devmode = '',
	connectstr = '',
	baseurl = '';

var modelOptions = {};

fs.readFile('passconf.json', 'utf8', function(err, data) {
	if(err) {
		console.log('er is geen paswoord vastgelegd');
	} else {
		//deze code is slechts tijdelijk om mijn app makkelijker te kunnen debuggen
		console.log('pasconf gevonden');
		console.log(data);
		
		var tmpobj = JSON.parse(data);
		pass = tmpobj.password;
		host = tmpobj.host;
		user = tmpobj.user;
		db = tmpobj.db;
		devmode = tmpobj.devmode;
		baseurl = tmpobj.baseurl;
		
		//connecteren
		if((user == '') && (pass == '')) {
			connectstr = 'mongodb://' + host + '/' + db;
		} else {
			connectstr = 'mongodb://' + user + ':' + pass + '@' + host + '/' + db;
		}
		
		console.log(connectstr);
		mongoose.connect(connectstr);
		
		modelOptions = {
			pass: pass,
			host: host,
			user: user,
			db: db,
			devmode: devmode,
			baseurl: baseurl
		};
	}
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
	gebruikersnaam: String,
	wachtwoord: String,
	naam: String,
	email: String,
	token: String,
	validated: Boolean
}, {collection: "gebruikers"});
var usermod = mongoose.model('Gebruiker', userSchema);

var projectSchema = new Schema({
	titel: String,
	//Is dit een goede naam voor deze kolom?
	prijs: Number,
	klant: {type: Schema.Types.ObjectId, ref: 'Klant'},
	gebruiker: {type: Schema.Types.ObjectId, ref: 'Gebruiker'}
}, {collection: "projecten"});
projectSchema.index({'titel': 'text'});
var projectmod = mongoose.model('Project', projectSchema);

var klantSchema = new Schema ({
	naam: String,
	telefoonnummer: String,
	email: String,
	gebruiker: {type: Schema.Types.ObjectId, ref: 'Gebruiker'}
}, {collection: "klanten"});
klantSchema.index({'naam': 'text'});
var klantmod = mongoose.model('Klant', klantSchema);

var trackSchema = new Schema({
	titel: String,
	//Dit type datum (isodate) wordt niet geaccepteerd door android
	begintijd: Date,
	eindtijd: Date,
	project: {type: Schema.Types.ObjectId, ref: 'Project'},
	gebruiker: {type: Schema.Types.ObjectId, ref: 'Gebruiker'}
}, {collection: "tracks"});
trackSchema.index({'titel': 'text'});
var trackmod = mongoose.model('Track', trackSchema);

var tokenSchema = new Schema({
	token: String,
	made: Date,
	gebruiker: {type: Schema.Types.ObjectId, ref: 'gebruiker'}
}, {collections: 'tokens'});
var tokenmod = mongoose.model('Token', tokenSchema);
/*
 * Om cascade mogelijk te maken
 */
projectSchema.pre('remove', function(next) {
	console.log('project remove hook');
	trackmod.find({project: this.id}, function(err, docs) {
		for(var i = 0; i < docs.length; i++) {
			var tmpdoc = docs[i];
			tmpdoc.remove();
		}
	});
	//~ console.log('hook: removing Project');
	next();
});

klantSchema.pre('remove', function(next) {
	console.log('client remove hook');
	projectmod.find({klant: this.id}, function(err, docs) {
		for(var i = 0; i < docs.length; i++) {
			var tmpdoc = docs[i];
			tmpdoc.remove();
		}
	});
	//~ console.log('hook: removing client');
	next();
});

//~ userSchema.pre('save', function(next) {
	//~ if(devmode == true) {
		//~ this.validated = true;
	//~ } else {
		//~ this.validated = false;
	//~ }
	//~ next();
//~ });

function sendMail(doc) {
	if(doc.validated == true) {
		console.log('Geen validatie vereist');
	} else {
		mg.sendText('pvankeymeulen@seanachaidh.be',
			doc.email, 'seanclog validation',
			doc.naam + ', please validate your mail\n'
			+ baseurl + '/api/validateuser/' + doc._id + '\n'
			+ 'kind regards, Seanachaidh', {},
		function(err) {
			if(err) console.log('er is iets fout gegaan');
			else console.log('validatie bericht met succes verzonden');
		});
	}
};

function checkUser(token, callback) {
	//callback is verplicht
	if(typeof callback !== 'function') {
		throw new Error('Geen callback opgegeven');
	}
	
	model.Token.findOne({token: token}, function(err, tok) {
		if(!tok){
			callback({value: false});
			return;
		}
		if(err) {
			console.log(err.message);
			callback({value: false});
			return;
		}
		model.Gebruiker.findById(tok.gebruiker, function(err, gebruiker) {
			if(!gebruiker) {
				callback({value: false});
				return;
			}
			if(err) {
				callback({value: false});
				return;
			}
			callback({value: true, id: gebruiker._id});
		});
	});
}

exports.isDevMode = function() {return devmode;};
exports.setDevMode = function(mode) {devmode = mode;}

exports.Track = trackmod;
exports.Project = projectmod;
exports.Klant = klantmod;
exports.Gebruiker = usermod;
exports.Token = tokenmod;

exports.sendMail = sendMail;
exports.modelOptions = modelOptions;
exports.checkUser = checkUser;
