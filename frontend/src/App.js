import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PostProjectPage from "./pages/PostProjectPage";
import MyProjectsPage from "./pages/MyProjectsPage";

// NEW PAGES YOU WILL CREATE
import BrowseProjectsPage from "./pages/BrowseProjectsPage";        // Freelancer browse
import ProjectDetailsPage from "./pages/ProjectDetailsPage";        // Apply / view details
import AppliedFreelancersPage from "./pages/AppliedFreelancersPage"; // Client sees applicants
import MyApplicationsPage from "./pages/MyApplicationsPage";         // Freelancer applied list

function App() {
  const token = localStorage.getItem("token");

  // Protect all pages that require login
  const PrivateRoute = (page) => {
    return token ? page : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ---------- PRIVATE ROUTES ---------- */}
        <Route path="/dashboard" element={PrivateRoute(<DashboardPage />)} />

        <Route path="/post-project" element={PrivateRoute(<PostProjectPage />)} />

        <Route path="/my-projects" element={PrivateRoute(<MyProjectsPage />)} />

        {/* FREELANCER FEATURE ROUTES */}
        <Route path="/browse" element={PrivateRoute(<BrowseProjectsPage />)} />

        <Route path="/project/:id" element={PrivateRoute(<ProjectDetailsPage />)} />

        <Route path="/my-applications" element={PrivateRoute(<MyApplicationsPage />)} />

        {/* CLIENT FEATURE ROUTES */}
        <Route
          path="/applied-freelancers/:projectId"
          element={PrivateRoute(<AppliedFreelancersPage />)}
        />

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
