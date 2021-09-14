const express = require("express"); // express: node.js web framework
const mongoose = require("mongoose"); // mongoose: outil de modelisation, passerelle entre mongoDB et Node.js
const path = require("path"); // path: gestion des répertoires et chemins de fichiers
const helmet = require("helmet"); // helmet: securise Express apps en configurant les headers HTTP.
const rateLimit = require("express-rate-limit"); // express-rate-limit : protection contre les attaques en force brute
const filter = require("content-filter"); // content-filter: protection contre les injections NoSql
require("dotenv").config(); // variables d'environnement chargées à partir du fichier .env

const limiter = rateLimit({
	// configuration du limiteur à 100 requêtes sur 15mn par IP
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Too many messages from this IP, please try again in 15mn",
});

const sauceRoutes = require("./routes/sauce"); // import des routes pour sauces
const userRoutes = require("./routes/user"); // import des routes pour users

// Framework Express
const app = express();

// remplace Appel à BodyParser maintenant inclus dans Express
app.use(express.json());

// content-filter: protection contre les injections NoSql
app.use(filter());

// activation des protections d'entêtes
app.use(helmet());
// activation du filtering pour cross-scripting protection (helmet)
app.use((req, res, next) => {
	res.setHeader("X-XSS-Protection", "1; mode=block");
	next();
});

// application du limiteur
app.use(limiter);

// connexion à la base mongodb
mongoose
	.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

// Définition du répertoire de stockage des fichiers statiques (images) sur le serveur
app.use("/images", express.static(path.join(__dirname, "images")));

// configuration des headers de requêtes pour le dev et les tests (CORS)
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// routes de l'API
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
