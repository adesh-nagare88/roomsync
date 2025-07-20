const Group = require("../models/Group");
const User = require("../models/User");

const generateCode = () => {
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

exports.createGroup = async (req, res) => {
  const { name, userId } = req.body;

  try {
    const code = generateCode();
    const group = await Group.create({ name, code, members: [userId], createdBy: userId,});

    res.status(201).json({ groupId: group._id, groupCode: group.code });
  } catch (err) {
    res.status(500).json({ message: "Group creation failed", error: err.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('members', 'name email').populate('createdBy','name_id');
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch group", error: err.message });
  }
};

exports.joinGroup = async (req, res) => {
  const { code, userId } = req.body;

  try {
    const group = await Group.findOne({ code });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json({ groupId: group._id, groupName: group.name });
  } catch (err) {
    res.status(500).json({ message: "Joining group failed", error: err.message });
  }
};
exports.uploadGroupDp = async (req, res) => {
  console.log("Uploaded file info:", req.file);
  const { groupId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagePath = `/uploads/${req.file.filename}`; // This assumes you serve static uploads

  try {
    const group = await Group.findByIdAndUpdate(
      groupId,
      { dp: imagePath },
      { new: true }
    );
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ message: "Group DP uploaded", dp: imagePath });
  } catch (err) {
    console.error("Upload backend error:", err.message);
    res.status(500).json({ message: "Failed to upload DP", error: err.message });
  }
};

exports.updateGroupName = async (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.name = name;
    await group.save();
    res.status(200).json({ message: "Group name updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// groupController.js
exports.removeMember = async (req, res) => {
  const { groupId } = req.params;
  const { memberId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.members = group.members.filter(
      (id) => id.toString() !== memberId.toString()
    );
    await group.save();

    res.status(200).json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ message: "Error removing member" });
  }
};

