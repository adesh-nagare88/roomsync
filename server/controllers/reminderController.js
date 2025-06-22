const Reminder = require("../models/Reminder");

exports.createReminder = async (req, res) => {
  const { groupId, message, dueDate, type, createdBy } = req.body;

  try {
    const reminder = await Reminder.create({ groupId, message, dueDate, type, createdBy });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: "Failed to create reminder", error: err.message });
  }
};

exports.getReminders = async (req, res) => {
  const { groupId } = req.params;

  try {
    const reminders = await Reminder.find({ groupId })
      .populate("createdBy", "name")
      .sort({ dueDate: 1 });

    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reminders", error: err.message });
  }
};
