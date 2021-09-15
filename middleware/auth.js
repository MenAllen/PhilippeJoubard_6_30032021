const jwt = require("jsonwebtoken");

// Authentification des requêtes par le token reçu
// ===============================================
module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1]; // extraction de token depuis "Bearer xxxxxx"
		const decodedToken = jwt.verify(token, process.env.TOKEN); // décodage du token par jsonwebtoken
		const userId = decodedToken.userId;

		// Si la requête body existe (PUT et POST) et que son userId diffère
		// du userId extrait du token, alors on sort en exception

		if (req.body.userId && req.body.userId !== userId) {
			throw "Invalid user ID"; // on sort en exception du try -> catch
		} else {
			// Sinon, on passe le userId extrait du token pour vérifier quand nécessaire au niveau controller
			req.user = userId;
			next();
		}
	} catch {
		res.status(403).json({ message: "Unauthorized request" });
	}
};
