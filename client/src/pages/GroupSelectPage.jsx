import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import NavBar from "../components/NavBar";

const GroupSelectPage = () => {
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/group/create", {
        name: groupName,
        userId: user.id,
      });

      console.log("Group Created:", res.data);

      if (res.data.groupId) {
        localStorage.setItem("groupId", res.data.groupId);
        navigate("/expenses");
      } else {
        alert("Group created but groupId not returned by server.");
      }
    } catch (err) {
      console.error("Create Group Error:", err);
      alert(err.response?.data?.message || "Failed to create group");
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/group/join", {
        code: joinCode,
        userId: user.id,
      });

      console.log("Group Joined:", res.data);

      if (res.data.groupId) {
        localStorage.setItem("groupId", res.data.groupId);
        navigate("/expenses");
      } else {
        alert("Group joined but groupId not returned by server.");
      }
    } catch (err) {
      console.error("Join Group Error:", err);
      alert(err.response?.data?.message || "Failed to join group");
    }
  };

  return (
  <>
  <NavBar />
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 sm:px-6 py-10 sm:py-16">
  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto space-y-10">
    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">Group Selection</h2>

    {/* Create Group */}
    <form onSubmit={handleCreateGroup} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">Create a New Group</h3>
      <input
        type="text"
        placeholder="Enter Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Create Group
      </button>
    </form>

    {/* Join Group */}
    <form onSubmit={handleJoinGroup} className="space-y-4 border-t pt-6">
      <h3 className="text-lg font-medium text-gray-700">Join an Existing Group</h3>
      <input
        type="text"
        placeholder="Enter Join Code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Join Group
      </button>
    </form>
  </div>
</div>
</>
);
};

export default GroupSelectPage;
