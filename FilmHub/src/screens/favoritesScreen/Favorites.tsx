/**
 * Favorites screen
 * - Displays the user's favorite movies fed by FavoritesContext
 * - Allows removing favorites and navigating to a movie detail
 * - Shares the global navbar and sticky back button pattern
 */
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../../API/favoritesContext";
import { useAuthContext } from "../../API/authContext";
import { moviesData } from "../carrouselScreen/movieData";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import Searchbar from "../../components/SearchBar/Searchbar";
import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import "../carrouselScreen/carrouselScreen.css";
import "./favorites.css";

const Favorites: React.FC = () => {
  const { favorites, remove } = useFavorites();
  const navigate = useNavigate();
  const { state } = useAuthContext() as any;
  const user = state?.user;
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Close the user dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!userMenuOpen) return;
      const target = e.target as Node | null;
      if (userMenuRef.current && target && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [userMenuOpen]);
  const favMovies = moviesData.filter((m) => favorites.includes(String(m.id)));

  return (
    <div className="app-container favorites-wrapper">
  {/* Global navbar */}
      <div className="navbar">
        <div className="brand">
          <Link to="/" className="logo-link">
            <BrandLogo className="logo" />
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
                <Link to="/favorites">Favorites</Link>
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
              <div className="user-menu" ref={userMenuRef}>
                <button
                  className="user-avatar"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  title={user?.username || user?.email}
                >
                  <FaUserCircle />
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown" role="menu">
                    <div className="user-header">{user?.firstName || user?.username || user?.email}</div>
                    <Link className="user-item" to="/profile" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                      Profile
                    </Link>
                    <div className="user-item" role="menuitem">
                      <LogoutButton />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

  

      <div className="favorites-header">
        <button className="back-button page-back" onClick={() => navigate(-1)}>← Back</button>
        <h2>My Favorites</h2>
      </div>
      {favMovies.length === 0 ? (
        <p className="empty">You don't have favorite movies yet.</p>
      ) : (
        <div className="favorites-grid">
          {favMovies.map((m) => (
            <div key={m.id} className="fav-card">
              <img
                src={m.thumbnailImage && !m.thumbnailImage.startsWith("/")
                  ? `/movie/movie-website-landing-page-images/movies/${m.thumbnailImage}`
                  : (m.thumbnailImage || "/images/fallback.png")}
                alt={m.title}
                className="fav-img"
              />
              <div className="fav-info">
                <h4>{m.title}</h4>
                <p className="muted">{m.genre} • {m.year}</p>
              </div>
              <div className="fav-actions">
                <Link to={`/player/${m.id}`} className="action-btn action-open">GO TO MOVIE</Link>
                <button className="action-btn action-remove" onClick={() => remove(String(m.id))}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
