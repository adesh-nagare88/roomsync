import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import NavBar from "../components/NavBar";

const GroupSelectPage = () => {
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [newGroupCode, setNewGroupCode] = useState("");
  const [showCode, setShowCode] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/group/create", {
        name: groupName,
        userId: user.id,
      });

      if (res.data.groupId) {
        localStorage.setItem("groupId", res.data.groupId);
        if (res.data.groupCode) {
        setNewGroupCode(res.data.groupCode);
        setShowCode(true);
      } else {
        navigate("/home");
      }
    } else {
      alert("Group created but groupId not returned by server.");
    }
  } catch (err) {
    alert("Failed to create group");
  }
};
  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/group/join", {
        code: joinCode,
        userId: user.id,
      });

      if (res.data.groupId) {
        localStorage.setItem("groupId", res.data.groupId);
        navigate("/home");
      } else {
        alert("Group joined but groupId not returned by server.");
      }
    } catch (err) {
      alert("Failed to join group");
    }
  };
  

  return (
  <>
  <NavBar />
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 sm:px-6 py-10 sm:py-16">
  <div className="max-w-2xl mx-auto space-y-8">
  {showCode && (
   <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative text-center">
    <strong className="font-semibold">Group Created!</strong>
    <p className="mt-1">
      Share this code with friends to join: <span className="font-mono font-bold">{newGroupCode}</span>
    </p>
    <button
      onClick={() => {
        setShowCode(false);
        navigate("/expenses"); // Redirect after closing
      }}
      className="mt-3 inline-block bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
    >
      Continue
    </button>
   </div>
  )}

    <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-4">Group Selection</h2>

    {/* Create Group */}
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow">
    <form onSubmit={handleCreateGroup} className="space-y-4">
      <h3 className="text-xl font-semibold mb-2 text-center sm:text-left text-gray-700">Create a New Group</h3>
      <input
        type="text"
        placeholder="Enter Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    <div className="flex justify-center">
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Create Group
      </button>
    </div>
    </form>
    </div>

    {/* Join Group */}
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow">
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
    <div class="flex justify-center">
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Join Group
      </button>
     </div>
    </form>
  </div>
</div>
<p className="text-center text-sm text-gray-600 mt-10 mb-4">
  © {new Date().getFullYear()} Adesh Nagare | Built with 💙 as RoomSync. All rights reserved.
</p>
</div>
</>
);
};

export default GroupSelectPage;
