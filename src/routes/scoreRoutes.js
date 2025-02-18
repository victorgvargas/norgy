const express = require("express");
const { getUserCounters, updateUserCounter, getGlobalCounters, resetUserCounters, resetGlobalCounters } = require("../controllers/counterControllers");
const router = express.Router();

// Get counters for the logged-in user
router.post("/user", getUserCounters);

// Increment or decrement a user counter
router.post("/update", updateUserCounter);

router.post("/reset-single", resetUserCounters);
// Get global counters for all users
router.get("/global", getGlobalCounters);

router.get("/reset", resetGlobalCounters);


module.exports = router;