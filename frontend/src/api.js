import axios from "axios";


const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_SERVER_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL;

const USER_API = `${API_BASE_URL}/api/users`;
const PROJECT_API = `${API_BASE_URL}/api/projects`;
const APPLICATION_API = `${API_BASE_URL}/api/applications`;


const api = axios.create({
  baseURL: USER_API,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});



export const signupUser = async (userData) => {
  try {
    const res = await api.post("/register", userData);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/login", credentials);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};



export const fetchProjects = async () => {
  try {
    const res = await axios.get(`${PROJECT_API}`);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const fetchProjectById = async (id) => {
  try {
    const res = await axios.get(`${PROJECT_API}/${id}`);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};



export const applyToProject = async ({ projectId, proposal, bid_amount }) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${APPLICATION_API}/apply`,
      { projectId, proposal, bid_amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const getAppliedProjects = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${APPLICATION_API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const withdrawApplication = async (applicationId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete(`${APPLICATION_API}/${applicationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};
