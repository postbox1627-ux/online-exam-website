import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useParams } from "react-router-dom";

const ExamMonitoring = () => {
  const { examId } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/monitoring/exam/${examId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Exam Monitoring</h2>

      {logs.length === 0 ? (
        <p>No alerts found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student</th>
              <th>Type</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((l) => (
              <tr key={l._id}>
                <td>{l.student?.name || "Student"}</td>
                <td>{l.type}</td>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExamMonitoring;
