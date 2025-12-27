import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_SERVER_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const signupUser = async (data) => {
  try {
    const res = await api.post("/api/users/register", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const loginUser = async (data) => {
  try {
    const res = await api.post("/api/users/login", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};


export const fetchProjects = async () => {
  try {
    const res = await api.get("/api/projects");
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const fetchProjectById = async (id) => {
  try {
    const res = await api.get(`/api/projects/${id}`);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const fetchClientProjects = async (clientId) => {
  try {
    const res = await api.get(`/api/projects/client/${clientId}`);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const updateProject = async (id, data) => {
  try {
    const res = await api.put(`/api/projects/${id}`, data);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const deleteProject = async (id) => {
  try {
    const res = await api.delete(`/api/projects/${id}`);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};


export const applyToProject = async ({ projectId, proposal, bid_amount }) => {
  try {
    const res = await api.post("/api/applications/apply", {
      projectId,
      proposal,
      bid_amount,
    });
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const getAppliedProjects = async () => {
  try {
    const res = await api.get("/api/applications/me");
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const getProjectApplications = async (projectId) => {
  try {
    const res = await api.get(`/api/applications/project/${projectId}`);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const withdrawApplication = async (applicationId) => {
  try {
    const res = await api.delete(`/api/applications/${applicationId}`);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};
export const getMe = async () => {
  try {
    const res = await api.get("/api/users/me");
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await api.put("/api/users/update", data);
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};
export const createProject = async (data) => {
  try {
    const res = await api.post("/api/projects/create", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

