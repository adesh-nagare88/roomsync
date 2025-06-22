const Notice = require("../models/Notice");

exports.createNotice = async (req, res) => {
  const { groupId, title, message, postedBy } = req.body;

  try {
    const notice = await Notice.create({ groupId, title, message, postedBy });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: "Failed to post notice", error: err.message });
  }
};

exports.getNotices = async (req, res) => {
  const { groupId } = req.params;

  try {
    const notices = await Notice.find({ groupId })
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notices", error: err.message });
  }
};
