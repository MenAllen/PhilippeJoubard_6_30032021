const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Schéma de données pour User
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

// Chargement du plugin uniqueValidator pour email
userSchema.plugin(uniqueValidator);

// Export du modèle mongoose User
module.exports = mongoose.model("User", userSchema);
