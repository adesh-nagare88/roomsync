const express = require("express");
const router = express.Router();
const { addExpense, getGroupExpenses,getBalances } = require("../controllers/expenseController");

router.post("/add", addExpense);
router.get("/:groupId", getGroupExpenses);
router.get("/:groupId/balances", getBalances);
module.exports = router;
