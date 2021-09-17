// in controllers/sauce.js
const Sauce = require("../models/sauce"); // Schéma de données sauce
const fs = require("fs"); // File systeme pour les fichiers image
const service = require("../data.services");

// GET pour toutes les sauces
// ==========================
exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			res.status(200).json(sauces);
		})
		.catch((error) => {
			res.status(400).json({ error });
		});
};

// GET d'une sauce, id en paramètre
// ================================
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			if (!sauce) {
				// La sauce n'existe pas
				return res.status(404).json({ message: "sauce not found" });
			}
			// la sauce existe, on renvoie à l'utilisateur
			res.status(200).json(sauce);
		})

		// Erreur requête findOne
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error });
		});
};

// POST de creation de sauce
// =========================
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);

	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});

	sauce
		.save()
		.then(() => {
			res.status(201).json({
				message: "Sauce saved successfully!",
			});
		})
		.catch((error) => {
			service.cleanImage(req.file.filename);
			res.status(400).json({ error });
		});
};

// PUT pour modification d'une sauce, id en paramètre
// ==================================================
exports.modifySauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// Si la sauce n'existe pas, on le signale et on supprime le fichier si reçu
			if (!sauce) {
				if (req.file) service.cleanImage(req.file.filename);
				return res.status(404).json({ message: "sauce not found" });
			}

			// Si l'auteur de la sauce et l'id de l'utilisateur diffèrent
			// alors l'action n'est pas autorisée
			if (sauce.userId !== req.user) {
				if (req.file) service.cleanImage(req.file.filename);
				return res.status(403).json({ message: "Unauthorized request" });
			}

			// Si l'image doit être remplacée, on aura besoin du nom de fichier actuel
			const currentfilename = sauce.imageUrl.split("/images/")[1];

			// Action autorisée. Deux formats possibles pour le body: avec ou sans image
			let sauceObject = {};

			if (req.file) {
				// Avec image: Récupérer la sauce et le nouveau nom de fichier
				sauceObject = JSON.parse(req.body.sauce);
				sauceObject.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
			} else {
				// Sans image, récupérer sauce dans le body
				sauceObject = req.body;
			}

			// On met à jour en base en supprimant l'image précédente si modifiée
			Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
				.then(() => {
					if (req.file) service.cleanImage(currentfilename);
					res.status(200).json({ message: "Sauce modified !" });
				})
				.catch((error) => {
					if (req.file) service.cleanImage(req.file.filename);
					res.status(400).json({ error });
				});
		})

		// Erreur requête findOne, on supprime l'image si reçue
		.catch((error) => {
			if (req.file) service.cleanImage(req.file.filename);
			console.error(error);
			res.status(500).json({ error });
		});
};

// DELETE pour suppression d'une sauce, id en paramètre
// ====================================================
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// Si la sauce n'existe pas, on le signale
			if (!sauce) {
				return res.status(404).json({ message: "sauce not found" });
			}

			// Si l'auteur de la sauce et l'id de l'utilisateur diffèrent
			// alors l'action n'est pas autorisée
			if (sauce.userId !== req.user) {
				res.status(403).json({ message: "Unauthorized request" });
				return sauce;
			}

			// Sinon, on supprime la sauce et l'image
			const filename = sauce.imageUrl.split("/images/")[1];

			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce deleted !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})

		// Erreur requête findOne
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error });
		});
};

// POST pour like / dislike d'une sauce, id en paramètre
// =====================================================
exports.likeSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// Si la sauce n'existe pas, on le signale
			if (!sauce) {
				return res.status(404).json({ message: "sauce not found" });
			}

			// La sauce existe, la demande peut être traitée
			switch (req.body.like) {
				case 0: // Enlever un Like ou un Dislike
					if (sauce.usersLiked.find((user) => user === req.body.userId)) {
						Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
							.then(() => res.status(201).json({ message: "Like removed !" }))
							.catch((error) => res.status(400).json(error));
					}
					if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
						Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
							.then(() => res.status(201).json({ message: "Dislike removed !" }))
							.catch((error) => res.status(400).json(error));
					}
					break;

				case 1: // Ajouter un Like
					if (!sauce.usersLiked.find((user) => user === req.body.userId)) {
						Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
							.then(() => res.status(201).json({ message: "Like added !" }))
							.catch((error) => res.status(400).json(error));
					}
					break;

				case -1: // Ajouter un Dislike
					if (!sauce.usersDisliked.find((user) => user === req.body.userId)) {
						Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
							.then(() => res.status(201).json({ message: "Dislike added !" }))
							.catch((error) => res.status(400).json(error));
					}
					break;

				default: {
					// Valeur like erronée: bad request
					res.status(400).json({ message: "Bad request: like value error" });
				}
			}
		})

		// Erreur requête findOne
		.catch((error) => {
			console.error(error);
			res.status(500).json(error);
		});
};
