import React, { useEffect, useState } from "react";
import axios from "../../axios";

const StudentResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/results/student`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setResults(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResults();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Results</h2>

      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Exam</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
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

export default StudentResults;
