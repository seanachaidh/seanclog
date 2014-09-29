/**
 * De modellen voor onze applicatie
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	gebruikersnaam: String,
	wachtwoord: String,
	naam: String,
	email: String
});

var projectSchema = new Schema({
	titel: String,
	prijs: Number,
	gebruiker: {type: Schema.types.ObjectId, ref: 'Gebruiker'}
});

var klantSchema = new Schema ({
	naam: String,
	telefoonnummer: String,
	email: String,
	gebruiker: {type: Schema.types.ObjectId, ref: 'Gebruiker'}
});

var trackSchema = new Schema({
	titel: String,
	begintijd: Date,
	eindtijd: Date,
	project: {type: Schema.types.ObjectId, ref: 'Project'},
	gebruiker: {type: Schema.types.ObjectId, ref: 'Gebruiker'}
});

var Track = mongoose.model('Track', trackschema);
var Project = mongoose.model('Project', projectSchema);
var Klant = mongoose.model('Klant', klantSchema);
var Gebruiker = mongoose.model('Gebruiker', userSchema);
