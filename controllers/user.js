const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// POST pour signup d'un nouvel utilisateur
// ========================================
exports.signup = (req, res, next) => {
	bcrypt
		.hash(req.body.password, 10) // password hashé avec un sel de 10
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			user // Sauvegarde en base sur reponse success
				.save()
				.then(() => res.status(201).json({ message: "User created !" }))

				// Erreur 400 Bad Request sur reponse erreur
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

// POST pour login d'un utilisateur
// ================================
exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				// l'utilisateur n'existe pas
				return res.status(401).json({ error: "User not found !" });
			}
			// L'utilisateur existe, on vérifie le password
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						// l'utilisateur existe mais le password ne correspond pas
						return res.status(401).json({ error: "Invalid password !" });
					}
					res.status(200).json({
						// l'utilisateur existe et le password est le bon
						userId: user._id,
						token: jwt.sign({ userId: user._id }, process.env.TOKEN, { expiresIn: "24h" }),
					});
				})
				// Erreur de comparaison bcrypt.compare
				.catch((error) => res.status(500).json({ error }));
		})
		// Erreur de recherche user.findone
		.catch((error) => res.status(500).json({ error }));
};
