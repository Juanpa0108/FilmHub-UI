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
import OverlayPortal from "../../components/OverlayPortal/OverlayPortal";
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
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const userBtnRef = useRef<HTMLButtonElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top?: number; bottom?: number; right: number } | null>(null);
  const [userPos, setUserPos] = useState<{ top?: number; bottom?: number; right: number } | null>(null);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const el = e.target as Element | null;
      if (el && el.closest && el.closest('.nav-overlay')) return;
      if (userMenuOpen) {
        const node = e.target as Node | null;
        if (userMenuRef.current && node && !userMenuRef.current.contains(node)) {
          setUserMenuOpen(false);
        }
      }
      if (menuAbierto) setMenuAbierto(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") { setUserMenuOpen(false); setMenuAbierto(false); }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [userMenuOpen, menuAbierto]);

  // Calculate overlay positions (flip + rAF like principal)
  useEffect(() => {
    const calcRight = (rect: DOMRect) => Math.max(8, window.innerWidth - rect.right);
    function placeBelowOrAbove(rect: DOMRect): { top?: number; bottom?: number; right: number } {
      const right = Math.round(calcRight(rect));
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const estimatedMenuH = 220;
      const NAVBAR_H = 70; const MIN_TOP = NAVBAR_H + 6;
      if (spaceBelow < estimatedMenuH) {
        return { bottom: Math.round(window.innerHeight - rect.top + 8), right };
      }
      const belowTop = Math.round(rect.bottom + 8);
      return { top: Math.max(belowTop, MIN_TOP), right };
    }

    if (menuAbierto && menuBtnRef.current) {
      const r = menuBtnRef.current.getBoundingClientRect();
      setMenuPos(placeBelowOrAbove(r));
    } else { setMenuPos(null); }
    if (userMenuOpen && userBtnRef.current) {
      const r = userBtnRef.current.getBoundingClientRect();
      setUserPos(placeBelowOrAbove(r));
    } else { setUserPos(null); }

    function shallowEqualPos(a: { top?: number; bottom?: number; right: number } | null, b: { top?: number; bottom?: number; right: number } | null) {
      if (!a || !b) return a === b;
      const topA = a.top ?? -99999, topB = b.top ?? -99999; const botA = a.bottom ?? -99999, botB = b.bottom ?? -99999;
      return Math.abs(topA - topB) < 0.5 && Math.abs(botA - botB) < 0.5 && Math.abs(a.right - b.right) < 0.5;
    }
    function updatePositions(){
      if (menuAbierto && menuBtnRef.current){
        const r = menuBtnRef.current.getBoundingClientRect();
        const next = placeBelowOrAbove(r);
        setMenuPos(prev => shallowEqualPos(prev, next) ? prev : next);
      }
      if (userMenuOpen && userBtnRef.current){
        const r = userBtnRef.current.getBoundingClientRect();
        const next = placeBelowOrAbove(r);
        setUserPos(prev => shallowEqualPos(prev, next) ? prev : next);
      }
    }
    const onResize = () => updatePositions();
    const onScroll = () => updatePositions();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    let rafId: number | null = null;
    if (menuAbierto || userMenuOpen) {
      const loop = () => { updatePositions(); rafId = requestAnimationFrame(loop); };
      rafId = requestAnimationFrame(loop);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    }
  }, [menuAbierto, userMenuOpen]);
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
              ref={menuBtnRef}
              onClick={() => {
                if (!menuAbierto && menuBtnRef.current) {
                  const r = menuBtnRef.current.getBoundingClientRect();
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
              <OverlayPortal className="user-dropdown nav-overlay" style={menuPos ?? undefined}>
                {user ? (
                  <>
                    <Link to="/categories" onClick={() => setMenuAbierto(false)}>Categories</Link>
                    <Link to="/my-reviews" onClick={() => setMenuAbierto(false)}>My Reviews</Link>
                    <Link to="/favorites" onClick={() => setMenuAbierto(false)}>Favorites</Link>
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
                          ? { bottom: Math.round(window.innerHeight - r.top + 8), right: Math.round(right) }
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
                    <div className="user-header">{user?.firstName || user?.username || user?.email}</div>
                    <Link className="user-item" to="/profile" role="menuitem" onClick={() => setUserMenuOpen(false)}>
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

  

      <section className="favorites-content">
        <div className="favorites-header">
          <button className="back-button page-back header-back" onClick={() => navigate(-1)}>← Back</button>
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
      </section>
    </div>
  );
};

export default Favorites;
