import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../API/authContext";
import Searchbar from "../../components/SearchBar/Searchbar";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import "../../screens/carrouselScreen/carrouselScreen.css";

const PremieresScreen: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { state } = useAuthContext() as any;
  const user = state?.user;

  return (
    <div className="app-container">
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

      <div className="movie-carousel-section">
        <h1 style={{ color: "white", textAlign: "center" }}>Categories</h1>
        <p style={{ color: "white", textAlign: "center", opacity: 0.8 }}>
          Aquí puedes explorar por géneros como acción, comedia, drama, y más.
        </p>
      </div>
    </div>
  );
};

export default PremieresScreen;
