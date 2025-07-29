import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import NavBar from "../components/NavBar";

const ExpensesPage = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [splitMembers, setSplitMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const navigate = useNavigate();

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const groupId = localStorage.getItem("groupId");

  useEffect(() => {
    if (!user || !groupId) {
      navigate("/group");
      return;
    }

    fetchExpenses();
    fetchBalances();
    fetchGroupMembers();
  }, [navigate]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`/expenses/${groupId}`);
      setExpenses(res.data);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const fetchBalances = async () => {
    try {
      const res = await axios.get(`/expenses/${groupId}/balances`);
      setBalances(res.data);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const fetchGroupMembers = async () => {
    try {
      const res = await axios.get(`/group/${groupId}`);
      setGroupMembers(res.data.members);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Something went wrong. Please try again.";
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid title and amount.");
      return;
    }

    const memberIds = splitMembers;
    if (memberIds.length === 0) {
      alert("Please select at least one member to split with.");
      return;
    }


    try {
      await axios.post("/expenses/add", {
        title: title.trim(),
        amount: parsedAmount,
        paidBy: user.id,
        splitBetween: memberIds,
        groupId,
      });

      setTitle("");
      setAmount("");
      fetchExpenses();
      fetchBalances();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto pt-8 sm:pt-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-8">Group Expenses</h1>
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8">
            <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="sm:col-span-2">
                <label className="font-medium mb-2 block">Split Between:</label>
                <div className="grid grid-cols-2 gap-2">
                  {groupMembers.map((member) => (
                    <label key={member._id} className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       value={member._id}
                       checked={splitMembers.includes(member._id)}
                      onChange={(e) => {
                        const id = e.target.value;
                        const checked = e.target.checked;
                     
                        setSplitMembers((prev) =>
                          checked ? [...prev, id] : prev.filter((m) => m !== id)
                        );
                      }}
                    />
                    <span>{member.name}</span>
                  </label>
                ))}
            </div>
          </div>

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
        <p className="text-center text-sm text-gray-600 mt-10 mb-4">
          © {new Date().getFullYear()} Adesh Nagare | Built with 💙 as RoomSync. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default ExpensesPage;
