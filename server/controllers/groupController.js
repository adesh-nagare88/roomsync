const Group = require("../models/Group");
const User = require("../models/User");

// Utility to generate 6-digit unique code
const generateCode = () => {
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const code = generateCode() || crypto.randomUUID().slice(0, 6).toUpperCase();
if (!code) {
  return res.status(500).json({ message: "Code generation failed" });
}

exports.createGroup = async (req, res) => {
  const { name, userId } = req.body;

  try {
    const code = generateCode();
    const group = await Group.create({ name, code, members: [userId] });

    // Optionally: update user with groupId (can be done via user model too)

    res.status(201).json({ groupId: group._id, groupCode: group.code });
  } catch (err) {
    res.status(500).json({ message: "Group creation failed", error: err.message });
  }
};

exports.joinGroup = async (req, res) => {
  const { code, userId } = req.body;

  try {
    const group = await Group.findOne({ code });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if already a member
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json({ groupId: group._id, groupName: group.name });
  } catch (err) {
    res.status(500).json({ message: "Joining group failed", error: err.message });
  }
};


