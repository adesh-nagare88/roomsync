const express = require("express");
const router = express.Router();
const { createReminder, getReminders } = require("../controllers/reminderController");

router.post("/create", createReminder);
router.get("/:groupId", getReminders);

module.exports = router;
