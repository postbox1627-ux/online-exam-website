import React, { useEffect, useState } from "react";
import axios from "../../axios";

const ViewResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/results`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Results</h2>

      {results.length === 0 ? (
        <p>No results available.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student</th>
              <th>Exam</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td>{r.student?.name || "Student"}</td>
                <td>{r.exam?.title || "Exam"}</td>
                <td>{r.score}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewResults;
