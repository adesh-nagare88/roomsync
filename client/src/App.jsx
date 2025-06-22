import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import GroupSelectPage from "./pages/GroupSelectPage";
import ExpensesPage from "./pages/ExpensesPage";
import NoticeBoardPage from "./pages/NoticeBoardPage";

function App() {
  const isLoggedIn = localStorage.getItem("token"); // placeholder for auth check

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/expenses" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/group" element={<GroupSelectPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/notice-board" element={<NoticeBoardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
