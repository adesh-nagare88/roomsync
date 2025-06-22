import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import NavBar from "../components/NavBar";

const ExpensesPage = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const groupId = localStorage.getItem("groupId");

  useEffect(() => {
    if (!user || !groupId) {
      console.warn("Missing user or groupId. Redirecting...");
      navigate("/group");
      return;
    }

    fetchExpenses();
    fetchBalances();
  }, []);
  console.log("user", user);
  console.log("groupId", groupId);

  const fetchExpenses = async () => {
    if (!groupId) return;
    try {
      const res = await axios.get(`/api/expenses/${groupId}`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const fetchBalances = async () => {
    if (!groupId) return;
    try {
      const res = await axios.get(`/api/expenses/${groupId}/balances`);
      setBalances(res.data);
    } catch (err) {
      console.error("Error fetching balances:", err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/expenses/add", {
        title,
        amount: parseFloat(amount),
        paidBy: user.id,
        splitBetween: [user.id], // Later: add all group members here
        groupId,
      });

      setTitle("");
      setAmount("");
      fetchExpenses();
      fetchBalances();
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  return (
    <>
  <NavBar />
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 sm:px-6">
    <div className="max-w-2xl mx-auto pt-8 sm:pt-12">
      <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-8">Group Expenses</h1>

      {/* Add Expense */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8">
        <form
          onSubmit={handleAddExpense}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border rounded-lg w-full"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 border rounded-lg w-full"
            required
          />
          <div className="sm:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* Member Balances */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">Member Balances</h2>
        <ul className="space-y-3">
          {balances.map((member) => (
            <li
              key={member.userId}
              className={`flex justify-between border-b pb-2 ${
                member.balance > 0
                  ? "text-green-600"
                  : member.balance < 0
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              <span>{member.name}</span>
              <span>
                {member.balance > 0
                  ? `Gets ₹${member.balance.toFixed(2)}`
                  : member.balance < 0
                  ? `Owes ₹${Math.abs(member.balance).toFixed(2)}`
                  : "Settled up"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expense List */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">Transaction History</h2>
        <ul className="space-y-3">
          {expenses.map((exp) => (
            <li key={exp._id} className="flex justify-between border-b pb-2 text-sm sm:text-base">
              <span>
                {exp.title} – ₹{exp.amount}
              </span>
              <span className="text-gray-500">Paid by {exp.paidBy.name}</span>
            </li>
          ))}
          {expenses.length === 0 && (
            <p className="text-gray-500 text-center">No expenses yet.</p>
          )}
        </ul>
      </div>
    </div>
  </div>
</>

)
};

export default ExpensesPage;
