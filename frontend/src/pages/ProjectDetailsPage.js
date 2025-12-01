import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const API = "http://localhost:5001/api";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // apply form
  const [cover, setCover] = useState("");
  const [bid, setBid] = useState("");

  useEffect(() => {
    fetch(`${API}/projects/${id}`)
      .then(r => r.json())
      .then(data => { setProject(data.project); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const decoded = jwtDecode(token);
    if (decoded.role !== "freelancer") { alert("Only freelancers can apply"); return; }

    const body = { project_id: id, freelancer_id: decoded.id, cover_letter: cover, bid };
    const res = await fetch(`${API}/proposals`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) { alert("Applied successfully"); setCover(""); setBid(""); }
    else { const data = await res.json(); alert(data.ERROR || "Error applying"); }
  };

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="project-details">
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <p>Budget: ₹{project.budget}</p>
      <p>Category: {project.category}</p>

      <hr />
      <h3>Apply to this project</h3>
      <textarea value={cover} onChange={e=>setCover(e.target.value)} placeholder="Cover letter" />
      <input value={bid} onChange={e=>setBid(e.target.value)} placeholder="Your bid (₹)" />
      <button onClick={handleApply}>Submit Proposal</button>
    </div>
  );
}
