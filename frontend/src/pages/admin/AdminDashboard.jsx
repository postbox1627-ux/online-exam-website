import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <p>Welcome, Admin!</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => alert("Create Exam Feature")}>
          Create Exam
        </button>

        <br /><br />

        <button onClick={() => alert("Manage Users Feature")}>
          Manage Users
        </button>

        <br /><br />

        <button onClick={() => alert("View Results Feature")}>
          View Results
        </button>

        <br /><br />

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
