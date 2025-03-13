import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const EditBatch = () => {
  const { id } = useParams(); // ✅ Extract batchId from URL
  const [batch, setBatch] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch Batch Data by ID
  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await API.get(`/Batch/${id}`); // ✅ Fixed template literal
        setBatch(res.data);
      } catch (err) {
        console.error("Error fetching batch:", err);
        alert("Failed to fetch batch.");
        navigate("/batches"); // Redirect if batch not found
      }
    };

    fetchBatch();
  }, [id, navigate]);

  // ✅ Handle Form Submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    const userId = 1; // Replace with actual logged-in user ID
    const updatedDate = new Date().toISOString();

    // ✅ Construct Updated Batch Object
    const updatedBatch = {
      ...batch,
      updatedBy: userId,
      updatedOn: updatedDate,
    };

    try {
      await API.put(`/Batch/${id}`, updatedBatch); // ✅ Fixed template literal
      alert("Batch updated successfully!");
      navigate("/batches"); // ✅ Redirect to batch list
    } catch (err) {
      console.error("Error updating batch:", err);
      alert("Failed to update batch.");
    }
  };

  // ✅ Ensure Batch Data Is Loaded
  if (!batch) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Batch</h2>

      <form onSubmit={handleUpdate}>
        {/* Name Field */}
        <div style={{ marginBottom: "10px" }}>
          <label>Batch Name:</label>
          <input
            type="text"
            value={batch.name || ""}
            onChange={(e) => setBatch({ ...batch, name: e.target.value })}
            required
          />
        </div>

        {/* Start Date Field */}
        <div style={{ marginBottom: "10px" }}>
          <label>Start Date:</label>
          <input
            type="date"
            value={batch.startDate ? batch.startDate.slice(0, 10) : ""}
            onChange={(e) => setBatch({ ...batch, startDate: e.target.value })}
            required
          />
        </div>

        {/* Seats Field */}
        <div style={{ marginBottom: "10px" }}>
          <label>Seats:</label>
          <input
            type="number"
            value={batch.seats || ""}
            onChange={(e) =>
              setBatch({ ...batch, seats: parseInt(e.target.value, 10) || 0 })
            }
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Update Batch</button>
      </form>

      {/* Navigation Back Button */}
      <button onClick={() => navigate("/batches")} style={{ marginTop: "20px" }}>
        Back to Batches
      </button>
    </div>
  );
};

export default EditBatch;