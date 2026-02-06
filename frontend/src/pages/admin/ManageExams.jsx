import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageExams = () => {
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
      <h2>Manage Exams</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Duration</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{e.subject}</td>
              <td>{e.duration} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageExams;
