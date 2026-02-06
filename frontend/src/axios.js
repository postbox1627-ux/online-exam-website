import axios from "axios";

const instance = axios.create({
  baseURL: "https://online-exams-website.onrender.com",
});

export default instance;
