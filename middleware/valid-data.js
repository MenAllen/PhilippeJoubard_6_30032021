const Joi = require("joi");

// Id de sauce passé en paramètre
const sauceIdSchema = Joi.string().alphanum().length(24).required();
exports.id = (req, res, next) => {
	const { error } = sauceIdSchema.validate(req.params.id);
	if (error) {
		res.status(400).json({ error: " Joi: Invalid Sauce Id" });
	} else {
		next();
	}
};

// Modele de sauce
const sauceSchema = Joi.object({
	userId: Joi.string().alphanum().length(24).required(),
	name: Joi.string().trim().min(1).required(),
	description: Joi.string().trim().min(1).required(),
	manufacturer: Joi.string().trim().min(1).required(),
	mainPepper: Joi.string().trim().min(1).required(),
	heat: Joi.number().integer().min(1).max(10).required(),
});
exports.sauce = (req, res, next) => {
	let sauce;

	// format différent si fichier image présent
	if (req.file) {
		sauce = JSON.parse(req.body.sauce);
	} else {
		sauce = req.body;
	}

	const { error } = sauceSchema.validate(sauce);
	if (error) {
		res.status(400).json({ error: "Joi: Invalid Sauce Data" });
	} else {
		next();
	}
};

// like / dislike
const likeSchema = Joi.object({
	userId: Joi.string().alphanum().length(24).required(),
	like: Joi.valid(-1, 0, 1).required(),
});
exports.like = (req, res, next) => {
	const { error } = likeSchema.validate(req.body);
	if (error) {
		res.status(400).json({ error: "Joi: Invalid userId or like Data" });
	} else {
		next();
	}
};

// Signup et Login
// email : format email avec 2 domains segments (example.com)
// password : au moins 8 caractères, au moins une minuscule, au moins une majuscule, au moins un chiffre

const userSchema = Joi.object({
	email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
	password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z](?=.*[0-9])).{8,}$")).required(),
});
exports.user = (req, res, next) => {
	const { error } = userSchema.validate(req.body);
	if (error) {
		res.status(400).json({ error: "Joi: Invalid email or password" });
	} else {
		next();
	}
};
