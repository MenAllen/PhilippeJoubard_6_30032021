const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// Chargement des variables d'environnement à partir du fichier .env
require("dotenv").config();

// connexion à la base mongodb
mongoose
	.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

// répertoire de stockage des images sur le serveur
app.use("/images", express.static(path.join(__dirname, "images")));

// configuration des headers
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// Remplace Appel à BodyParser maintenant inclus dans Express
app.use(express.json());

// activation du filtre de contenu
app.use(mongoSanitize());

// activation des protections d'entêtes
app.use(helmet());

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
