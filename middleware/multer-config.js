const multer = require("multer");

const MIME_TYPES = {
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/png": "png",
};

// Configuration de Multer dans la constante storage
// avec 2 paramètres : detination et filename
// ==================================================
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		// Destination dans le répertoire images
		callback(null, "images");
	},

	filename: (req, file, callback) => {
		// filename récupéré du nom de fichier avec mise en forme
		const name = file.originalname.split(".")[0];
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + "_" + Date.now() + "." + extension);
	},
});

// export de multer configuré avec storage, pour gérer fichiers image uniquement
module.exports = multer({ storage: storage }).single("image");
