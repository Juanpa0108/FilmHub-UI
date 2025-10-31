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
import Searchbar from "../../components/SearchBar/Searchbar";
import CarrouselScreen from "../carrouselScreen/carrouselScreen";
import ResultsScreen from "../resultsScreen/resultsScreen";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import OverlayPortal from "../../components/OverlayPortal/OverlayPortal";
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
  const [menuPos, setMenuPos] = useState<{ top?: number; bottom?: number; right: number } | null>(null);
  const [userPos, setUserPos] = useState<{ top?: number; bottom?: number; right: number } | null>(null);
  const [authTick, setAuthTick] = useState(0);

  // Refs for click-outside detection
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const userBtnRef = useRef<HTMLButtonElement | null>(null);

  const { state } = useAuthContext();
  const user = state?.user;

  // ------------------------
  // 🧭 Handle menu closing (click outside / ESC)
  // ------------------------
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node | null;

      // If click happens inside a portal overlay, do nothing
      if (target && (target as Element).closest && (target as Element).closest('.nav-overlay')) {
        return;
      }

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

  // Calculate and set overlay positions anchored to buttons when opened
  useEffect(() => {
    function calcRight(rect: DOMRect) {
      return Math.max(8, window.innerWidth - rect.right);
    }
    function placeBelowOrAbove(rect: DOMRect): { top?: number; bottom?: number; right: number } {
      const right = Math.round(calcRight(rect));
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const estimatedMenuH = 220; // heuristic
      const NAVBAR_H = 70; // keep in sync with CSS
      const MIN_TOP = NAVBAR_H + 6; // never render under the navbar edge
      if (spaceBelow < estimatedMenuH) {
        // place above using bottom-based anchoring to avoid transform glitches
        return { bottom: Math.round(window.innerHeight - rect.top + 8), right };
      }
      // place below, but clamp to be at least just below navbar
      const belowTop = Math.round(rect.bottom + 8);
      return { top: Math.max(belowTop, MIN_TOP), right };
    }
    if (menuAbierto && menuBtnRef.current) {
      const r = menuBtnRef.current.getBoundingClientRect();
      setMenuPos(placeBelowOrAbove(r));
    } else {
      setMenuPos(null);
    }
    if (userMenuOpen && userBtnRef.current) {
      const r = userBtnRef.current.getBoundingClientRect();
      setUserPos(placeBelowOrAbove(r));
    } else {
      setUserPos(null);
    }
    // Recalculate on resize/scroll to keep it near the button
    function shallowEqualPos(a: { top?: number; bottom?: number; right: number } | null, b: { top?: number; bottom?: number; right: number } | null) {
      if (!a || !b) return a === b;
      const topA = a.top ?? -99999; const topB = b.top ?? -99999;
      const botA = a.bottom ?? -99999; const botB = b.bottom ?? -99999;
      return Math.abs(topA - topB) < 0.5 && Math.abs(botA - botB) < 0.5 && Math.abs(a.right - b.right) < 0.5;
    }

    function updatePositions() {
      if (menuAbierto && menuBtnRef.current) {
        const r = menuBtnRef.current.getBoundingClientRect();
        const next = placeBelowOrAbove(r);
        setMenuPos((prev) => (shallowEqualPos(prev, next) ? prev : next));
      }
      if (userMenuOpen && userBtnRef.current) {
        const r = userBtnRef.current.getBoundingClientRect();
        const next = placeBelowOrAbove(r);
        setUserPos((prev) => (shallowEqualPos(prev, next) ? prev : next));
      }
    }
    const onResize = () => updatePositions();
    const onScroll = () => updatePositions();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // rAF loop to keep overlay perfectly anchored even when scrolling a nested container
    let rafId: number | null = null;
    function loop() {
      updatePositions();
      rafId = window.requestAnimationFrame(loop);
    }
    if (menuAbierto || userMenuOpen) {
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    }
  }, [menuAbierto, userMenuOpen]);

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
            <button
              className="menu-button"
              ref={menuBtnRef}
              onClick={() => {
                if (!menuAbierto && menuBtnRef.current) {
                  const r = menuBtnRef.current.getBoundingClientRect();
                  // compute position BEFORE rendering so it never flashes at 0,0
                  const right = Math.max(8, window.innerWidth - r.right);
                  const spaceBelow = window.innerHeight - r.bottom - 8;
                  const estimatedMenuH = 220;
                  const pos = spaceBelow < estimatedMenuH
                    ? { bottom: Math.round(window.innerHeight - r.top + 8), right: Math.round(right) }
                    : { top: Math.round(r.bottom + 8), right: Math.round(right) };
                  setMenuPos(pos);
                  setMenuAbierto(true);
                } else {
                  setMenuAbierto(false);
                }
              }}
            >
              ☰
            </button>
            {menuAbierto && (
              // Use the same base class as Profile for stable behavior;
              // anchors are styled via CSS to look like the original vertical menu.
              <OverlayPortal className="user-dropdown nav-overlay" style={menuPos ?? undefined}>
                {user ? (
                  <>
                    <Link to="/categories" onClick={() => setMenuAbierto(false)}>
                      Categories
                    </Link>
                    <Link to="/my-reviews" onClick={() => setMenuAbierto(false)}>
                      My Reviews
                    </Link>
                    <Link to="/favorites" onClick={() => setMenuAbierto(false)}>
                      Favorites
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuAbierto(false)}>Login</Link>
                    <Link to="/register" onClick={() => setMenuAbierto(false)}>Register</Link>
                  </>
                )}
              </OverlayPortal>
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
                  ref={userBtnRef}
                  onClick={() => {
                    setUserMenuOpen((v) => {
                      const next = !v;
                      if (next && userBtnRef.current) {
                        const r = userBtnRef.current.getBoundingClientRect();
                        const right = Math.max(8, window.innerWidth - r.right);
                        const spaceBelow = window.innerHeight - r.bottom - 8;
                        const estimatedMenuH = 220;
                        const pos = spaceBelow < estimatedMenuH
                          ? { top: Math.round(r.top - 8), right: Math.round(right), transform: "translateY(-100%)" as const }
                          : { top: Math.round(r.bottom + 8), right: Math.round(right) };
                        setUserPos(pos);
                      }
                      return next;
                    });
                  }}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  title={user?.username || user?.email}
                >
                  <FaUserCircle />
                </button>
                {userMenuOpen && (
                  <OverlayPortal className="user-dropdown nav-overlay" role="menu" style={userPos ?? undefined}>
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
                  </OverlayPortal>
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