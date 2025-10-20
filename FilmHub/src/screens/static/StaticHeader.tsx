import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./static.css";

export default function StaticHeader() {
  const navigate = useNavigate();
  return (
    <div className="static-header">
      <button className="btn btn-back" onClick={() => navigate(-1)} aria-label="Go back">← Back</button>
      <Link to="/" className="static-logo">
        <img src="/logo.png" alt="FilmHub" />
      </Link>
    </div>
  );
}