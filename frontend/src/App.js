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
import FreelancersAppliedList from "./pages/FreelancersAppliedList";  
import MyApplicationsPage from "./pages/MyApplicationsPage";
import ProfilePage from "./pages/ProfilePage";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};


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

        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

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

        

        <Route
          path="/applied-freelancers"
          element={
            <PrivateRoute>
              <AppliedFreelancersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/applied-freelancers/:projectId"
          element={
            <PrivateRoute>
              <FreelancersAppliedWrapper />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
