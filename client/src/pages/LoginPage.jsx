import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      setIsSubmitting(true);
      const res = await axios.post(endpoint, {
        email:email.trim(),
        password:password.trim(),
        ...(isLogin ? {} : { name:name.trim() }),
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/group");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }finally{
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 sm:px-6 pt-12">
  <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow space-y-6">
    <h2 className="text-3xl font-semibold text-center text-gray-800">
      {isLogin ? "Login" : "Register"}
    </h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 rounded-lg transition ${
          isSubmitting
            ? "bg-blue-400 cursor-not-allowed text-white"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Register"}
      </button>
    </form>

    <p className="text-sm text-center text-gray-700">
      {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="text-blue-600 underline ml-1"
      >
        {isLogin ? "Register" : "Login"}
      </button>
    </p>
  </div>

  <p className="text-center text-sm text-gray-600 mt-10 mb-4">
    © {new Date().getFullYear()} RoomSync. All rights reserved.
  </p>
</div>
  );
};

export default LoginPage;
