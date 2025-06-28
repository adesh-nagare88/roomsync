const Expense = require("../models/Expense");
const Group = require("../models/Group");

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, paidBy, splitBetween, groupId } = req.body;

    if (!title || !amount || !paidBy || !splitBetween || !groupId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newExpense = await Expense.create({
      title,
      amount,
      paidBy,
      splitBetween,
      groupId,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error: error.message });
  }
};

exports.getGroupExpenses = async (req, res) => {
  const { groupId } = req.params;

  try {
    
    const expenses = await Expense.find({ groupId }).populate("paidBy", "name").sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses", error: err.message });
  }
};

exports.getBalances = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate("members", "name");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const expenses = await Expense.find({ groupId });

    const balances = {};

    group.members.forEach((member) => {
      balances[member._id] = { name: member.name, balance: 0 };
    });

    for (const expense of expenses) {
      const share = expense.amount / expense.splitBetween.length;

      expense.splitBetween.forEach((userId) => {
        const uid = userId.toString();
        const paidById = expense.paidBy.toString();

        if (uid !== paidById) {
          if (balances[uid]) {
            balances[uid].balance -= share;
          }
        }
      });
      const paidByStr = expense.paidBy.toString();
      const payerShare = share * (expense.splitBetween.length - 1);

      if (balances[paidByStr]) {
        balances[paidByStr].balance += expense.amount - payerShare;
      }
    }

    const result = Object.entries(balances).map(([userId, { name, balance }]) => ({
      userId,
      name,
      balance,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
