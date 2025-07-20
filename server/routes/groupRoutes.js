const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { 
    createGroup, 
    joinGroup,
    getGroupById,
    uploadGroupDp,
    updateGroupName,
    removeMember
} = require("../controllers/groupController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `group-${req.params.groupId}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/create", createGroup);
router.post("/join", joinGroup);
router.get('/:groupId', getGroupById);
router.post("/upload-dp/:groupId", upload.single("dp"), uploadGroupDp);
router.put("/:groupId/name", updateGroupName);
router.put("/:groupId/remove-member", removeMember);


module.exports = router;
