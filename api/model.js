/**
 * De modellen voor onze applicatie
 */

var mongoose = require('mongoose');

//connecteren met de databank
mongoose.connect('mongodb://pietervk:ragnarok@lennon.mongohq.com:10094/app29880742');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	gebruikersnaam: String,
	wachtwoord: String,
	naam: String,
	email: String
}, {collection: "gebruikers"});

var projectSchema = new Schema({
	titel: String,
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
