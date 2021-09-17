const fs = require("fs"); // File systeme pour les fichiers image

// Suppression d'image (multer copie l'image avant la validation de la requête)
// ============================================================================
exports.cleanImage = function (filename) {
	fs.unlink(`images/${filename}`, (err) => {
		if (err) console.error(err);
	});
};
