const express = require("express");
const router = express.Router();
const validate = require("../middleware/valid-data");

const userCtrl = require("../controllers/user");

// Déclaration des routes user, sans authentification
router.post("/signup", validate.user, userCtrl.signup);
router.post("/login", validate.user, userCtrl.login);

module.exports = router;
