import React, { useEffect, useState } from "react";
import axios from "axios";

const MonitoringDashboard = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/exams`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Monitoring Dashboard</h2>

      {exams.length === 0 ? (
        <p>No exams available.</p>
      ) : (
        <ul>
          {exams.map((e) => (
            <li key={e._id}>
              {e.title} —{" "}
              <a href={`/monitoring/exam/${e._id}`}>Monitor</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MonitoringDashboard;
