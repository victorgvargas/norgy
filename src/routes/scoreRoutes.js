const express = require("express");
const { getUserCounters, updateUserCounter, getGlobalCounters, resetGlobalCounters } = require("../controllers/counterControllers");
const router = express.Router();

// Get counters for the logged-in user
router.get("/user", getUserCounters);

// Increment or decrement a user counter
router.post("/update", updateUserCounter);

// Get global counters for all users
router.get("/global", getGlobalCounters);

router.get("/reset", resetGlobalCounters);

module.exports = router;