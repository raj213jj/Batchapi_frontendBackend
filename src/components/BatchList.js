import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found. Redirecting to login.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get("https://localhost:7153/api/Batch", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Fixed template literal
          },
        });
        console.log("Fetched batches:", response.data);
        setBatches(response.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
        alert("Error fetching batches. Please try again later.");
      }
    };

    fetchBatches();
  }, [navigate]);

  // ✅ Handle Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Batch List</h2>

      {/* Navigation Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/add")} style={{ marginRight: "10px" }}>
          Add Batch
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Display Batches */}
      {batches.length === 0 ? (
        <p>No batches found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>Seats</th>
              <th>Created By</th>
              <th>Created On</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.batchId}>
                <td>{batch.batchId}</td>
                <td>{batch.name}</td>
                <td>{new Date(batch.startDate).toLocaleDateString()}</td>
                <td>{batch.seats}</td>
                <td>{batch.createdBy ?? "Unknown"}</td>
                <td>{new Date(batch.createdOn).toLocaleDateString()}</td>
                <td>{batch.isActive ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => navigate(`/edit/${batch.batchId}`)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BatchList;