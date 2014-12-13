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
	email: String
}, {collection: "gebruikers"});

var projectSchema = new Schema({
	titel: String,
	//Is dit een geode naam voor deze kolom?
	prijs: Number,
	gebruiker: {type: Schema.Types.ObjectId, ref: 'Gebruiker'}
}, {collection: "projecten"});

var klantSchema = new Schema ({
	naam: String,
	telefoonnummer: String,
	email: String,
	gebruiker: {type: Schema.Types.ObjectId, ref: 'Gebruiker'}
}, {collection: "klanten"});

var trackSchema = new Schema({
	titel: String,
	begintijd: Date,
	eindtijd: Date,
	project: {type: Schema.Types.ObjectId, ref: 'Project'},
	gebruiker: {type: Schema.Types.ObjectId, ref: 'Gebruiker'}
}, {collection: "tracks"});

exports.Track = mongoose.model('Track', trackSchema);
exports.Project = mongoose.model('Project', projectSchema);
exports.Klant = mongoose.model('Klant', klantSchema);
exports.Gebruiker = mongoose.model('Gebruiker', userSchema);
