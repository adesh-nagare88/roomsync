import axios from "axios";

const instance = axios.create({
  baseURL:import.meta.env.BACKEND_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default instance;
