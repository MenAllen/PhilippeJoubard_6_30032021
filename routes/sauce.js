const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");
const validate = require("../middleware/valid-data");

// Déclaration des routes sauce, avec authentification (auth) par token,
// téléchargement d'image (multer)  et  validation par joi
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, validate.id, sauceCtrl.getOneSauce);
router.post("/", auth, multer, validate.sauce, sauceCtrl.createSauce);
router.put("/:id", auth, multer, validate.id, validate.sauce, sauceCtrl.modifySauce);
router.delete("/:id", auth, validate.id, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, validate.id, validate.like, sauceCtrl.likeSauce);

module.exports = router;
