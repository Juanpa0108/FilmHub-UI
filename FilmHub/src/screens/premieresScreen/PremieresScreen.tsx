import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../API/authContext";
import Searchbar from "../../components/SearchBar/Searchbar";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import { moviesData } from "../carrouselScreen/movieData";
import "../../screens/carrouselScreen/carrouselScreen.css";
import "./PremieresScreen.css"; // 👈 nuevo archivo CSS

const PremieresScreen: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { state } = useAuthContext() as any;
  const user = state?.user;

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="brand">
          <Link to="/">
            <BrandLogo className="logo" />
          </Link>
          <span className="brand-text">
            Film <span className="brand-subtext">Hub</span>
          </span>
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
                <Link to="/premieres">Watch Now!</Link>
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

      {/* MAIN CONTENT */}
      <div className="movie-grid-container">
        <h1 className="section-title">Watch Now</h1>

        <div className="movie-grid">
          {moviesData.map((movie) => (
            <Link
              key={movie.id}
              to={`/player/${movie.id}`}
              className="movie-card"
            >
              <img
                src={movie.thumbnailImage}
                alt={movie.title}
                className="movie-thumbnail"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremieresScreen;
