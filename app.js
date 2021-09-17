const express = require("express"); // node.js web framework
const mongoose = require("mongoose"); // outil de modelisation, passerelle entre mongoDB et Node.js
const helmet = require("helmet"); // securise Express apps en configurant les headers HTTP.
const path = require("path"); // gestion des répertoires et chemins de fichiers
const rateLimit = require("express-rate-limit"); // protection contre les attaques en force brute
require("dotenv").config(); // variables d'environnement chargées à partir du fichier .env

const sauceRoutes = require("./routes/sauce"); // import des routes pour sauces
const userRoutes = require("./routes/user"); // import des routes pour users

// connexion à la base mongodb
mongoose
	.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("MongoDB connexion succeeded !"))
	.catch(() => console.log("MongoDB connexion failed !"));

// Framework Express
const app = express();

// configuration des headers (CORS)
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// BodyParser maintenant inclus dans Express
app.use(express.json());

// configuration des entêtes HTTP
app.use(helmet());

// configuration de l'entête X-XSS-Protecion dans l'entête HTTP
app.use((req, res, next) => {
	res.setHeader("X-XSS-Protection", "1; mode=block");
	next();
});

// configuration à 200 requêtes sur 15' par IP et application du limiteur
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
});
app.use(limiter);

// Définition du répertoire de stockage des fichiers statiques (images) sur le serveur
app.use("/images", express.static(path.join(__dirname, "images")));

// routes de l'API
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
