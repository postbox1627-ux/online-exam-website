import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useParams } from "react-router-dom";

const ManageQuestions = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/questions/exam/${examId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Questions</h2>

      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Question</th>
              <th>Correct Answer</th>
              <th>Marks</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((q) => (
              <tr key={q._id}>
                <td>{q.text}</td>
                <td>{q.correctAnswer}</td>
                <td>{q.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageQuestions;
