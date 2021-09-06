// in controllers/sauce.js
const Sauce = require("../models/sauce"); // Schéma de données sauce
const fs = require("fs"); // File systeme pour les fichiers image

// GET pour toutes les sauces
// ==========================
exports.getAllSauce = (req, res, next) => {
	console.log("getAllSauce");

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
	console.log("getOneSauce");

	Sauce.findOne({
		_id: req.params.id,
	})
		.then((sauce) => {
			res.status(200).json(sauce);
		})
		.catch((error) => {
			res.status(404).json({ error });
		});
};

// POST de creation de sauce
// =========================
exports.createSauce = (req, res, next) => {
	console.log("createSauce");

	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});

	sauce
		.save()
		.then(() => {
			res.status(201).json({
				message: "Post saved successfully!",
			});
		})
		.catch((error) => {
			res.status(400).json({ error });
		});
};

// PUT pour modification d'une sauce, id en paramètre
// ==================================================
exports.modifySauce = (req, res, next) => {
	console.log("modifySauce");

	// Deux formats possibles pour le body: avec ou sans image
	const sauceObject = req.file
		? {
				// Si image est modifiée, récupérer aussi le nouveau nom de fichier
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }
		: { ...req.body }; // Sinon, récupérer sauce dans le body

	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Sauce modified !" }))
		.catch((error) => res.status(400).json({ error }));
};

// POST pour like / dislike d'une sauce, id en paramètre
// =====================================================
exports.likeSauce = (req, res, next) => {
	console.log("likeSauce");

	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
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
					// Erreur
					return res.status(500).json({ error });
				}
			}
		})
		.catch((error) => res.status(400).json(error));
};

// DELETE pour suppression d'une sauce, id en paramètre
// ====================================================
exports.deleteSauce = (req, res, next) => {
	console.log("deleteSauce");

	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// Si l'auteur de la sauce et l'id de l'utilisateur diffèrent
			// alors l'action n'est pas autorisée
			if (sauce.userId !== req.user) {
				res.status(403).json({ message: "Unauthorized request" });
				return sauce;
			}

			// Sinon, on supprime la sauce et l'image
			const filename = sauce.imageUrl.split("/images/")[1];
			console.log(filename);
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce deleted !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};
