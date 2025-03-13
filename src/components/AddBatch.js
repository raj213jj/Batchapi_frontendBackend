import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBatch = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [seats, setSeats] = useState("");

  const navigate = useNavigate();

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve token from local storage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please login again.");
      navigate("/");
      return;
    }

    // ✅ Construct batch object matching your backend schema
    const batch = {
      name: name,
      startDate: startDate, // ISO date format
      seats: parseInt(seats, 10), // Ensure number type

      // Tracking fields
      createdBy: 1, // Replace with the logged-in user's ID
      createdOn: new Date().toISOString(),
      updatedBy: null,
      updatedOn: null,
      isActive: true,
    };

    console.log("Submitting batch:", batch);

    try {
      // ✅ Ensure Authorization header uses backticks for template literal
      const response = await axios.post(
        "https://localhost:7153/api/Batch",
        batch,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed template literal
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Batch added successfully:", response.data);

      // ✅ Navigate back to the batches list page after success
      navigate("/batches");
    } catch (error) {
      console.error("Error adding batch:", error);

      // ✅ Improved error handling
      if (error.response) {
        alert(`Error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        alert("No response from the server. Check your network connection.");
      } else {
        alert("An unknown error occurred while adding the batch.");
      }
    }
  };

  // ✅ Handle logout and remove token
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add New Batch</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/batches")}>Back to Batches</button>
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div style={{ marginBottom: "10px" }}>
          <label>Name: </label>
          <br />
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter batch name"
          />
        </div>

        {/* Start Date Field */}
        <div style={{ marginBottom: "10px" }}>
          <label>Start Date: </label>
          <br />
          <input
            type="date"
            value={startDate}
            required
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* Seats Field */}
        <div style={{ marginBottom: "10px" }}>
          <label>Seats: </label>
          <br />
          <input
            type="number"
            value={seats}
            required
            onChange={(e) => setSeats(e.target.value)}
            placeholder="Enter number of seats"
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Add Batch</button>
      </form>
    </div>
  );
};

export default AddBatch;