import axios from "axios";

const baseURL = process.env.PUBLIC_URL_API || "http://localhost:8000";

const client = axios.create({
  baseURL,
  withCredentials: true,
});

export default client;