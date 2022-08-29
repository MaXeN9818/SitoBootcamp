const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
		minLength: [6, 'Password non valida: Lunghezza minima 6 caratteri'],
		maxLength: [20, 'Password non valida: Lunghezza massima 20 caratteri'],
		match: [/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, 'Password non valida:\n- Almeno una lettera maiuscola\n- Almeno una lettera minuscola\n- Almeno un numero'],
	},

	hasPlayer: {
		type: mongoose.Schema.Types.Boolean,
		required: true,
		default: false,
	},

	policy: {
		type: Array,
		required: true,
		defualt: [],
	},
});

userSchema.plugin(uniqueValidator, { message: '{PATH} già esistente!'});

userSchema.pre('save', async function(next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.statics.login = async function (username, password) {
	const user = await this.findOne({ username });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error('Credenziali non valide!');
	}
	throw Error('Credenziali non valide!');
};

const User = new mongoose.model('user', userSchema);
module.exports = User;
