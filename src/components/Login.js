import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Send login request to the backend
      const res = await API.post("/Authentication/login", { email, password });
      const token = res.data.token;

      if (!token) {
        alert("Login failed: No token received.");
        return;
      }

      // ✅ Log and store the token
      console.log("Token received:", token);
      localStorage.setItem("token", token);

      // ✅ Navigate to batches after successful login
      navigate("/batches");
    } catch (err) {
      console.error("Login failed:", err);

      if (err.response) {
        alert(`Login failed: ${err.response.data}`);
      } else {
        alert("Network error: Unable to reach the server.");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;