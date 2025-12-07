import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PostProjectPage from "./pages/PostProjectPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import EditProjectPage from "./pages/EditProjectPage";

import BrowseJobsPage from "./pages/BrowseJobsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import AppliedFreelancersPage from "./pages/AppliedFreelancersPage"; 
import FreelancersAppliedList from "./pages/FreelancersAppliedList";  // ⭐ ADD THIS
import MyApplicationsPage from "./pages/MyApplicationsPage";
import ProfilePage from "./pages/ProfilePage";

// ====================
// PRIVATE ROUTE
// ====================
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// ====================
// WRAPPER TO GET projectId
// ====================
function FreelancersAppliedWrapper() {
  const { projectId } = useParams();
  return <FreelancersAppliedList projectId={projectId} />;
}

function App() {

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* CLIENT ROUTES */}
        <Route
          path="/post-project"
          element={
            <PrivateRoute>
              <PostProjectPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-projects"
          element={
            <PrivateRoute>
              <MyProjectsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-project/:id"
          element={
            <PrivateRoute>
              <EditProjectPage />
            </PrivateRoute>
          }
        />

        {/* FREELANCER ROUTES */}
        <Route
          path="/browse"
          element={
            <PrivateRoute>
              <BrowseJobsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <PrivateRoute>
              <MyApplicationsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/project/:id"
          element={
            <PrivateRoute>
              <ProjectDetailsPage />
            </PrivateRoute>
          }
        />

        {/* ================================
            CLIENT VIEWING APPLIED FREELANCERS
            ================================ */}

        {/* SHOW PROJECT LIST */}
        <Route
          path="/applied-freelancers"
          element={
            <PrivateRoute>
              <AppliedFreelancersPage />
            </PrivateRoute>
          }
        />

        {/* SHOW FREELANCER LIST FOR A PROJECT */}
        <Route
          path="/applied-freelancers/:projectId"
          element={
            <PrivateRoute>
              <FreelancersAppliedWrapper />
            </PrivateRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
