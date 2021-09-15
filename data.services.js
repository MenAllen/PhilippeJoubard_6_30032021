const fs = require("fs"); // File systeme pour les fichiers image

// Suppression d'image (multer copie l'image avant la validation de la requête)
// ============================================================================
exports.cleanImage = function (filename) {
	fs.unlink(`images/${filename}`, (err) => {
		if (err) console.error(err);
	});
};

// ============================================================================
exports.checkPassword = function (password) {
	// Le password doit avoir au moins 8 caractères, au moins une minuscule, au moins une majuscule, au moins un chiffre
	var regex = /(?=.*[a-z])(?=.*[A-Z](?=.*[0-9])).{8,}/;
	return regex.test(password);
};
