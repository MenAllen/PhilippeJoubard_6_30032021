// in controllers/user.js
const bcrypt = require("bcrypt"); // module de cryptage SHA1 pour password
const jwt = require("jsonwebtoken"); // module d'authentification par token

const User = require("../models/User");

// POST pour signup d'un nouvel utilisateur
// ========================================
exports.signup = (req, res, next) => {
	bcrypt
		.hash(req.body.password, 10) // password hashé
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			user
				.save() // Tentative de sauvegarde en base

				// Sauvegarde OK
				.then(() => res.status(201).json({ message: "User created !" }))

				// Erreur 400 Bad Request: Erreur de validation si user existe
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
				return res.status(404).json({ message: "Invalid credential" });
			}

			// L'utilisateur existe, on vérifie que le password est le bon
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						// l'utilisateur existe mais le password ne correspond pas
						return res.status(401).json({ message: "Invalid credential" });
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

		// Erreur requête findOne
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error });
		});
};
