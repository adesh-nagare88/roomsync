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
    const group = await Group.create({ name, code, members: [userId] });

    res.status(201).json({ groupId: group._id, groupCode: group.code });
  } catch (err) {
    res.status(500).json({ message: "Group creation failed", error: err.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('members', 'name email');
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
