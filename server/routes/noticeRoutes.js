const express = require("express");
const router = express.Router();
const { createNotice, getNotices } = require("../controllers/noticeController");

router.post("/create", createNotice);
router.get("/:groupId", getNotices);

module.exports = router;
