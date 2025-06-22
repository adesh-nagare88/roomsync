import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // adjust for backend
  withCredentials: true, // optional for cookies
});

export default instance;
