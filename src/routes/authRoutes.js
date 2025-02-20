const express = require("express");
const { getUserById, register, login, logout } = require("../controllers/authControllers");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/user", getUserById);

module.exports = router;