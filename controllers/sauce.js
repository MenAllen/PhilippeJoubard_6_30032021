// in controllers/sauce.js
const Sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
	console.log("createSauce");
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});
	console.log(req.file);
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
