const jwt = require("jsonwebtoken");

// Authentification des requêtes par le token reçu
// ===============================================
module.exports = (req, res, next) => {
	console.log("auth");

	try {
		const token = req.headers.authorization.split(" ")[1]; // extraction de token depuis "Bearer xxxxxx"
		const decodedToken = jwt.verify(token, process.env.TOKEN); // décodage du token par jsonwebtoken
		const userId = decodedToken.userId;

		// Ici il faut s'assurer qu'une modification de sauce n'est autorisée que par le créateur de la sauce:
		// 			Si la requête body existe (PUT et POST) et que le userId dans l'objet Sauce diffère
		// 			du userId extrait du token, alors on sort en exception

		if (req.body.userId && req.body.userId !== userId) {
			throw "Invalid user ID"; // on sort en exception du try -> catch
		} else {
			// 			sinon, on passe le userId extrait du token pour vérifier au niveau controller dans le cas du DELETE
			req.user = userId;
			console.log(req.user);
			next();
		}
	} catch {
		console.log("Invalid request");
		res.status(403).json({
			error: new Error("Unauthorized request"),
		});
	}
};
