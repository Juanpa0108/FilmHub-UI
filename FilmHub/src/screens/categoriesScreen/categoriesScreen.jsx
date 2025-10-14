import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import useAuth from "../../API/auth";
import Searchbar from "../../components/SearchBar/Searchbar";
import LogoutButton from "../../components/LogoutButton/logoutButton";
import "../../screens/carrouselScreen/carrouselScreen.css";
import "./categoriesScreen.css";

const CategoriesScreen = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user } = useAuth();

  const categories = [
    { name: "Action", emoji: "🔥" },
    { name: "Comedy", emoji: "😂" },
    { name: "Drama", emoji: "🎭" },
    { name: "Horror", emoji: "👻" },
    { name: "Sci-Fi", emoji: "🚀" },
    { name: "Romance", emoji: "❤️" },
    { name: "Thriller", emoji: "🔪" },
    { name: "Animation", emoji: "🎬" },
  ];

  return (
    <div className="app-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="brand">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <Link to="/" className="brand-text-link">
            <span className="brand-text">
              Film <span className="brand-subtext">Hub</span>
            </span>
          </Link>
        </div>

        <div className="header">
          <Searchbar />

          <div className="menu-container">
            <button
              className="menu-button"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              ☰
            </button>
            {menuAbierto && (
              <div className="dropdown-menu">
                <Link to="/categories">Categories</Link>
                <Link to="/my-reviews">My Reviews</Link>
                <Link to="/premieres">Premieres</Link>
                <Link to="/coming-soon">Coming Soon</Link>
              </div>
            )}
          </div>

          <div className="auth-buttons">
            {!user ? (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            ) : (
              <LogoutButton />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="categories-section">
        <h2>Movie Categories</h2>
        <p>Select a genre and discover awesome films!</p>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card">
              <span className="category-emoji">{cat.emoji}</span>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesScreen;
