import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_SERVER_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL;

const API_URL = `${API_BASE_URL}/api/users`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signupUser = async (userData) => {
  try {
    const res = await api.post("/register", userData);
    return res.data;
  } 
  catch (err) {
    return err.response?.data || { message: "Network error" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/login", credentials);
    return res.data;
  } 
  catch (err) {
    return err.response?.data || { message: "Network error" };
  }
};
