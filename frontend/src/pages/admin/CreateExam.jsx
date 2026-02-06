import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateExam = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/exams`,
        { title, subject, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Exam Created Successfully");
      navigate("/admin/exams");
    } catch (err) {
      alert("Failed to create exam");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Exam</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateExam;
