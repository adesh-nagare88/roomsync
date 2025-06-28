import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("groupId");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="text-xl font-semibold text-blue-600">RoomSync</div>

        <div className="hidden md:flex items-center space-x-4 text-sm sm:text-base">
          <Link
            to="/expenses"
            className={`px-3 py-2 rounded-lg ${
              isActive("/expenses")
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            } transition`}
          >
            Expenses
          </Link>
          <Link
            to="/notice-board"
            className={`px-3 py-2 rounded-lg ${
              isActive("/notice-board")
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            } transition`}
          >
            Notice Board
          </Link>
          <Link
            to="/group"
            className={`px-3 py-2 rounded-lg ${
              isActive("/group")
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            } transition`}
          >
            Change Group
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm">
          <Link
            to="/expenses"
            className={`block px-3 py-2 rounded-lg ${
              isActive("/expenses")
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Expenses
          </Link>
          <Link
            to="/notice-board"
            className={`block px-3 py-2 rounded-lg ${
              isActive("/notice-board")
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Notice Board
          </Link>
          <Link
            to="/group"
            className={`block px-3 py-2 rounded-lg ${
              isActive("/group")
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Change Group
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="block w-full text-left bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
