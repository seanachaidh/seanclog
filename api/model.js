/**
 * De modellen voor onze applicatie
 */

var mongoose = require('mongoose');

//de text die op dit moment geparsed is
var ctext = '';
var fs = require('fs');

//gegevens om te connecteren
var pass = '',
	host = '',
	user = '',
	db = '';
	connectstr = '';

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
		
		//connecteren
		if((user == '') && (pass == '')) {
			connectstr = 'mongodb://' + host + '/' + db;
		} else {
			connectstr = 'mongodb://' + user + ':' + pass + '@' + host + '/' + db;
		}
		
		console.log(connectstr);
		mongoose.connect(connectstr);
	}
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
	gebruikersnaam: String,
	wachtwoord: String,
	naam: String,
	email: String,
	token: String
}, {collection: "gebruikers"});
var usermod = mongoose.model('Gebruiker', userSchema);

var projectSchema = new Schema({
	titel: String,
	//Is dit een goede naam voor deze kolom?
	prijs: Number,
	klant: {type: Schema.Types.ObjectId, ref: 'Klant'},
	gebruiker: {type: Schema.Types.ObjectId, ref: 'Gebruiker'}
}, {collection: "projecten"});
var projectmod = mongoose.model('Project', projectSchema);

var klantSchema = new Schema ({
	naam: String,
	telefoonnummer: String,
	email: String,
	gebruiker: {type: Schema.Types.ObjectId, ref: 'Gebruiker'}
}, {collection: "klanten"});
var klantmod = mongoose.model('Klant', klantSchema);



var trackSchema = new Schema({
	titel: String,
	//Dit type datum (isodate) wordt niet geaccepteerd door android
	begintijd: Date,
	eindtijd: Date,
	project: {type: Schema.Types.ObjectId, ref: 'Project'},
	gebruiker: {type: Schema.Types.ObjectId, ref: 'Gebruiker'}
}, {collection: "tracks"});
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
	debugger;
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
	debugger;
	projectmod.find({klant: this.id}, function(err, docs) {
		for(var i = 0; i < docs.length; i++) {
			var tmpdoc = docs[i];
			tmpdoc.remove();
		}
	});
	//~ console.log('hook: removing client');
	next();
});

exports.Track = trackmod;
exports.Project = projectmod;
exports.Klant = klantmod;
exports.Gebruiker = usermod;
exports.Token = tokenmod;
