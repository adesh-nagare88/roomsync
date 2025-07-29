import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import NavBar from "../components/NavBar";

const HomePage = () => {
  const [group, setGroup] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const groupId = localStorage.getItem("groupId");

  const isAdmin = group?.createdBy?._id === user.id;

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`/group/${groupId}`);
      setGroup(res.data);
      setNewName(res.data.name);
      console.log("Group Data:", res.data);
      console.log("group.createdBy:", res.data.createdBy);
      console.log("isAdmin:", res.data.createdBy?._id === user.id);

    } catch {
      alert("Failed to fetch group details.");
    }
  };


  const handleUpdateGroupName = async () => {
    try {
      await axios.put(`/group/${groupId}/name`, { name: newName });
      setEditingName(false);
      fetchGroup();
    } catch {
      alert("Failed to update group name.");
    }
  };

  const handleDPChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("dp", file);

    try {
      setUploading(true);
      await axios.post(`/group/upload-dp/${groupId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchGroup();
    } catch(err){
      console.error("Upload Error:", err?.response?.data || err.message);
      alert("Failed to upload group picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      setRemoving(memberId);
      await axios.put(`/group/${groupId}/remove-member`, { memberId });
      fetchGroup();
    } catch {
      alert("Failed to remove member.");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 sm:px-6 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
          {/* Group Display Picture */}
          <div className="flex flex-col items-center space-y-2">
            {group?.dp && (
              <img
                src={`https://roomsync-backend.onrender.com${group.dp}`}
                alt="Group DP"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border"
              />
            )}
            console.log("DP Path:", group.dp);
            {isAdmin && (
              <label className="text-sm text-blue-600 hover:underline cursor-pointer">
                {uploading ? "Uploading..." : "Change Group Picture"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDPChange}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Group Name */}
          <div className="text-center space-y-2">
            {editingName && isAdmin ? (
              <div className="flex flex-col items-center space-y-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="p-2 border rounded w-full max-w-sm"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleUpdateGroupName}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <h1 className="text-2xl font-semibold">{group?.name}</h1>
                {isAdmin && (
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-blue-600 text-sm underline"
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
            <p className="text-sm text-gray-600">
              Group Code: <span className="font-mono">{group?.code}</span>
            </p>
            <p className="text-xs text-gray-400">
              Created At: {new Date(group?.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Member List */}
          <div>
            <h2 className="text-lg font-medium mb-4 text-center sm:text-left">Group Members</h2>
            <ul className="space-y-3">
              {group?.members.map((member) => (
                <li
                  key={member._id}
                  className="flex justify-between items-center border-b pb-2 text-sm"
                >
                  <div>
                    <span>{member.name}</span>
                    {member._id === group?.createdBy?._id && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-300 text-yellow-900 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  {isAdmin && member._id !== user.id && (
                    <button
                      disabled={removing === member._id}
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      {removing === member._id ? "Removing..." : "Remove"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
