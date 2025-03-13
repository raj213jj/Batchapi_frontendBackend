import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import BatchList from "./components/BatchList";
import AddBatch from "./components/AddBatch";
import EditBatch from "./components/EditBatch";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/batches" element={<BatchList />} />
        <Route path="/add" element={<AddBatch />} />
        <Route path="/edit/:id" element={<EditBatch />} />
      </Routes>
    </Router>
  );
};

export default App;