import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.mode === "development" ? "http://localhost:3000/api" : '/api/v1',
  withCredentials: true
});

export default apiRequest;