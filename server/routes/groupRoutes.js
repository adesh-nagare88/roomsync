const express = require("express");
const router = express.Router();
const { createGroup, joinGroup,getGroupById } = require("../controllers/groupController");

router.post("/create", createGroup);
router.post("/join", joinGroup);
router.get('/:groupId', getGroupById);

module.exports = router;
