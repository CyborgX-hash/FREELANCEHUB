import axios from "axios";

/* ---------------------------------------------------
   BASE URL (LOCAL + PRODUCTION)
--------------------------------------------------- */
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_SERVER_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL;

/* API BASE PATHS */
const USER_API = `${API_BASE_URL}/api/users`;
const PROJECT_API = `${API_BASE_URL}/api/projects`;
const APPLICATION_API = `${API_BASE_URL}/api/applications`;

/* ---------------------------------------------------
   AXIOS INSTANCE + AUTO TOKEN
--------------------------------------------------- */
const api = axios.create({
  baseURL: USER_API,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ===================================================
   🔹 USER AUTH & PROFILE
=================================================== */

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

export const getProfile = async () => {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await api.put("/update", data);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

/* ===================================================
   🔹 PROJECT APIs  
=================================================== */

/* Create project */
export const createProject = async (projectData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${PROJECT_API}/create`, projectData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

/* Get logged-in client's projects */
export const getMyProjects = async () => {
  try {
    const token = localStorage.getItem("token");

    // Correct backend path: GET /api/projects/client/:clientId
    const res = await axios.get(`${PROJECT_API}/client/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

/* Get all public projects */
export const fetchProjects = async () => {
  try {
    const res = await axios.get(`${PROJECT_API}`);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

/* Get project by ID */
export const fetchProjectById = async (id) => {
  try {
    const res = await axios.get(`${PROJECT_API}/${id}`);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

/* ===================================================
   🔹 APPLICATION APIs (Freelancers)
=================================================== */

/* Apply to a project */
export const applyToProject = async ({ projectId, proposal, bid_amount }) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${APPLICATION_API}/apply`,
      { projectId, proposal, bid_amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

/* Get all applications by logged-in freelancer */
export const getAppliedProjects = async () => {
  try {
    const token = localStorage.getItem("token");

    // Correct backend route → GET /api/applications/me
    const res = await axios.get(`${APPLICATION_API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

/* Withdraw application */
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

/* Get freelancers applied for a project (client) */
export const getFreelancersForProject = async (projectId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${APPLICATION_API}/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};
