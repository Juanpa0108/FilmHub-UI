/**
 * Principal Screen Component
 *
 * Main home page of the FilmHub app.
 * Displays featured carousels, banners, and search results.
 * Includes global navigation bar with search, user menu, and general menu.
 *
 * Features:
 *  - Search functionality with live filtering by title, genre, or year.
 *  - Dynamic user authentication menu (login/register or profile/logout).
 *  - Click-outside and Escape key handlers to close dropdowns.
 *  - Real-time auth state sync using a global `auth:changed` event.
 *  - Responsive and accessible navigation with ARIA attributes.
 *
 * Imported Components:
 *  - CarruselInfinito: Infinite scrolling banner.
 *  - Carrusel: Static movie carousel.
 *  - CarrouselScreen: Main featured movies section.
 *  - ResultsScreen: Displays search results.
 *  - Searchbar: Input field for movie search with suggestions.
 *  - LogoutButton: Handles secure user logout.
 *  - BrandLogo: Application logo component.
 *
 * Dependencies:
 *  - React Hooks: useState, useEffect, useRef.
 *  - React Router: Link.
 *  - Auth Context: useAuthContext for user state.
 *  - Icons: react-icons (FaUserCircle).
 *
 * Behavior Summary:
 *  - When a user is logged in, shows their avatar and dropdown options.
 *  - If no user session exists, shows "Register" and "Login" links.
 *  - Filters movies dynamically based on user input.
 *  - Closes menus automatically when clicking outside or pressing ESC.
 */

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../API/authContext";

// Components
import CarruselInfinito from "../../components/Carrusel/carruselInfinito";
import Carrusel from "../../components/Carrusel/carrusel";
import Searchbar from "../../components/SearchBar/Searchbar";
import CarrouselScreen from "../carrouselScreen/carrouselScreen";
import ResultsScreen from "../resultsScreen/resultsScreen";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import { FaUserCircle } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo/BrandLogo";

// Data and styles
import { moviesData } from "../carrouselScreen/movieData";
import "./principal.css";

const Principal: React.FC = () => {
  // ------------------------
  // 🔍 State Management
  // ------------------------
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authTick, setAuthTick] = useState(0);

  // Refs for click-outside detection
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { state } = useAuthContext();
  const user = state?.user;

  // ------------------------
  // 🧭 Handle menu closing (click outside / ESC)
  // ------------------------
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node | null;

      // User menu
      if (userMenuOpen && userMenuRef.current && target && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }

      // Main menu
      if (menuAbierto && menuRef.current && target && !menuRef.current.contains(target)) {
        setMenuAbierto(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setMenuAbierto(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [userMenuOpen, menuAbierto]);

  // ------------------------
  // 🔁 Auth State Sync (refresh on context change)
  // ------------------------
  useEffect(() => {
    const handler = () => setAuthTick((v) => v + 1);
    window.addEventListener("auth:changed", handler as EventListener);
    return () => window.removeEventListener("auth:changed", handler as EventListener);
  }, []);

  // ------------------------
  // 🎬 Filter movies by search query
  // ------------------------
  const peliculasFiltradas = (moviesData || []).filter(
    (peli) =>
      peli.title.toLowerCase().includes(busqueda.toLowerCase()) ||
      peli.genre.toLowerCase().includes(busqueda.toLowerCase()) ||
      peli.year.includes(busqueda)
  );

  const titulos = moviesData.map((p) => p.title);

  const images = [
    "/font-awesome/images/img1.jpg",
    "/font-awesome/images/img2.jpg",
    "/font-awesome/images/img3.jpg",
    "/font-awesome/images/img4.jpg",
  ];

  // ------------------------
  // 🖥️ Render UI
  // ------------------------
  return (
    <div className="app-container">
      {/* ---------- NAVBAR ---------- */}
      <div className="navbar">
        <div className="brand">
          <Link to="/" className="logo-link">
            <BrandLogo className="logo" />
          </Link>
        </div>

        <div className="header">
          <Searchbar onSearch={setBusqueda} suggestions={titulos} />

          {/* General Menu */}
          <div className="menu-container" ref={menuRef}>
            <button className="menu-button" onClick={() => setMenuAbierto(!menuAbierto)}>
              ☰
            </button>
            {menuAbierto && (
              <div className="dropdown-menu">
                <Link to="/categories" onClick={() => setMenuAbierto(false)}>
                  Categories
                </Link>
                <Link to="/my-reviews" onClick={() => setMenuAbierto(false)}>
                  My Reviews
                </Link>
                <Link to="/favorites" onClick={() => setMenuAbierto(false)}>
                  Favorites
                </Link>
              </div>
            )}
          </div>

          {/* User Menu */}
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
                    <div className="user-header">
                      {user?.firstName || user?.username || user?.email}
                    </div>
                    <Link
                      className="user-item"
                      to="/profile"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
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

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="movie-carousel-section">
        <CarrouselScreen />
      </div>

      <div className="carrusel-banner">
        <CarruselInfinito images={images} />
      </div>

      <div className="static-carousel-container">
        <Carrusel />
      </div>

      {/* Search Results Section */}
      {busqueda ? (
        <div className="search-results">
          {peliculasFiltradas.length > 0 ? (
            <div className="results-banner">
              <ResultsScreen searchResults={peliculasFiltradas} searchTerm={busqueda} />
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      ) : (
        <div className="results-banner">
          <ResultsScreen />
        </div>
      )}
    </div>
  );
};

export default Principal;
