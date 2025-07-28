import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import NavBar from "../components/NavBar";

const NoticeBoardPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [reminderText, setReminderText] = useState("");
  const [reminderType, setReminderType] = useState("custom");
  const [dueDate, setDueDate] = useState("");
  const [notices, setNotices] = useState([]);
  const [reminders, setReminders] = useState([]);

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const groupId = localStorage.getItem("groupId");

  const handlePostNotice = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/notices/create", {
        groupId,
        title,
        message,
        postedBy: user.id,
      });
      setTitle("");
      setMessage("");
      fetchNotices();
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to post notice", err);
      }
      alert("Something went wrong. Please try again.");
    }
  };

  const handlePostReminder = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/reminders/create", {
        groupId,
        message: reminderText,
        type: reminderType,
        dueDate,
        createdBy: user.id,
      });
      setReminderText("");
      setReminderType("custom");
      setDueDate("");
      fetchReminders();
    } catch (err) {
      alert("Failed to post reminder");
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
      await axios.delete(`/notices/delete/${noticeId}`);
      fetchNotices();
    } catch (err) {
      alert("Failed to delete notice");
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`/notices/${groupId}`);
      setNotices(res.data);
    } catch (err) {
      alert("Failed to fetch notices");
    }
  };

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`/reminders/${groupId}`);
      setReminders(res.data);
    } catch (err) {
      alert("Failed to fetch reminders");
    }
  };

  useEffect(() => {
    if (!user || !groupId) return;
    fetchNotices();
    fetchReminders();
  }, []);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 sm:px-6 pb-12">
        <div className="max-w-2xl mx-auto pt-8 sm:pt-12 space-y-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-center">
            Notice Board & Reminders
          </h1>

          {/* Post Notice */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Post a Notice</h2>
            <form onSubmit={handlePostNotice} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border rounded-lg h-28"
                required
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>

          {/* Post Reminder */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Create a Reminder</h2>
            <form onSubmit={handlePostReminder} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={reminderType}
                onChange={(e) => setReminderType(e.target.value)}
                className="p-3 border rounded-lg"
              >
                <option value="custom">Custom</option>
                <option value="rent">Rent</option>
                <option value="bill">Bill</option>
                <option value="chore">Chore</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Reminder message"
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                className="p-3 border rounded-lg sm:col-span-2"
                required
              />
              <div className="sm:col-span-2 flex justify-center">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add Reminder
                </button>
              </div>
            </form>
          </div>

          {/* Notices List */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">All Notices</h2>
            {notices.length === 0 ? (
              <p className="text-gray-500 text-center">No notices posted yet.</p>
            ) : (
              <ul className="space-y-4">
                {notices.map((notice) => (
                  <li key={notice._id} className="border-b pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{notice.title}</h3>
                        <p className="text-sm">{notice.message}</p>
                        <p className="text-xs text-gray-500">
                          Posted by {notice.postedBy?.name || "Unknown"} on {" "}
                          {new Date(notice.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {notice.postedBy?._id === user.id && (
                        <div className="flex flex-col space-y-1 text-sm">
                          <button
                            onClick={() => handleDeleteNotice(notice._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reminders List */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Upcoming Reminders</h2>
            {reminders.length === 0 ? (
              <p className="text-gray-500 text-center">No upcoming reminders.</p>
            ) : (
              <ul className="space-y-4">
                {reminders.map((reminder) => (
                  <li key={reminder._id} className="border-b pb-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="font-medium">{reminder.message}</span>
                      <span className="text-gray-500">
                        Due: {new Date(reminder.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Type: {reminder.type}, Created by: {reminder.createdBy?.name}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      <p className="text-center text-sm text-gray-600 mt-10 mb-4">
        © {new Date().getFullYear()} Adesh Nagare | Built with 💙 as RoomSync. All rights reserved.
      </p>
      </div>
    </>
  );
};

export default NoticeBoardPage;
