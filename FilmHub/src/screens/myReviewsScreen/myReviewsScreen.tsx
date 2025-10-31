/**
 * My Reviews screen
 * - Lists the authenticated user's own reviews
 * - Supports inline edit (rating + text) and delete for each review
 * - Reuses the global navbar and sticky back button
 */
import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../API/authContext";
import Searchbar from "../../components/SearchBar/Searchbar";
import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import OverlayPortal from "../../components/OverlayPortal/OverlayPortal";
import { apiPath } from "../../config/env";
import "../../screens/carrouselScreen/carrouselScreen.css";
import "./myReviewsScreen.css";

const MyReviewsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuthContext() as any;
  const user = state?.user;
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const userBtnRef = useRef<HTMLButtonElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top?: number; bottom?: number; right: number } | null>(null);
  const [userPos, setUserPos] = useState<{ top?: number; bottom?: number; right: number } | null>(null);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const el = e.target as Element | null;
      if (el && el.closest && el.closest('.nav-overlay')) return; // clicks inside portal
      // User menu
      if (userMenuOpen) {
        const node = e.target as Node | null;
        if (userMenuRef.current && node && !userMenuRef.current.contains(node)) {
          setUserMenuOpen(false);
        }
      }
      // Main menu
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

  // Calculate overlay positions anchored to trigger buttons (flip + rAF like principal)
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

  // Shape of an individual review owned by the logged in user
  type Review = { id: string; movieId: string; movieTitle?: string; rating: number; text: string; createdAt: string };
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editRating, setEditRating] = useState<number | ''>('');

  // Initial load: fetch user's reviews from backend
  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      try {
        const token = (state as any)?.accessToken || localStorage.getItem("accessToken");
        const res = await fetch(apiPath("/api/reviews/me"), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load reviews");
        const data = await res.json();
        if (!mounted) return;
        const items: Review[] = (data.reviews || []).map((r: any) => ({
          id: r._id,
          movieId: r.movieId,
          movieTitle: r.movieTitle,
          rating: r.rating,
          text: r.text,
          createdAt: r.createdAt,
        }));
        setReviews(items);
      } catch (_) {
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchReviews();
    return () => { mounted = false };
  }, []);

  // Remove a review from backend and from local state
  const handleDelete = async (reviewId: string) => {
    try {
      const token = (state as any)?.accessToken || localStorage.getItem("accessToken");
      const res = await fetch(apiPath(`/api/reviews/${encodeURIComponent(reviewId)}`), {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed');
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (_) {}
  }

  // Start editing a particular review
  const beginEdit = (r: Review) => {
    setEditingId(r.id);
    setEditText(r.text);
    setEditRating(r.rating);
  }
  // Cancel edit, reset local edit state
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditRating('');
  }
  // Persist edit to backend, then update the local list
  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const token = (state as any)?.accessToken || localStorage.getItem("accessToken");
      const res = await fetch(apiPath(`/api/reviews/${encodeURIComponent(editingId)}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ text: editText.trim(), ...(editRating !== '' ? { rating: editRating } : {}) })
      });
      if (!res.ok) throw new Error('Failed to update');
      const data = await res.json().catch(() => ({}));
      const upd = data?.review;
      setReviews(prev => prev.map(r => r.id === editingId ? {
        ...r,
        text: upd?.text ?? editText,
        rating: upd?.rating ?? (typeof editRating === 'number' ? editRating : r.rating)
      } : r));
      cancelEdit();
    } catch (_) {}
  }

  return (
    <div className="app-container">
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
              aria-haspopup="true"
              aria-expanded={menuAbierto}
            >
              ☰
            </button>
            {menuAbierto && (
              <OverlayPortal className="user-dropdown nav-overlay" role="menu" style={menuPos ?? undefined}>
                {user ? (
                  <>
                    <Link to="/categories" role="menuitem" onClick={() => setMenuAbierto(false)}>Categories</Link>
                    <Link to="/my-reviews" role="menuitem" onClick={() => setMenuAbierto(false)}>My Reviews</Link>
                    <Link to="/favorites" role="menuitem" onClick={() => setMenuAbierto(false)}>Favorites</Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" role="menuitem" onClick={() => setMenuAbierto(false)}>Login</Link>
                    <Link to="/register" role="menuitem" onClick={() => setMenuAbierto(false)}>Register</Link>
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

  {/* Sticky back button aligned to the left, under navbar */}
      <div className="back-wrapper">
        <button className="back-button page-back" onClick={() => navigate(-1)}>← BACK</button>
      </div>

      <div className="reviews-section">
        <h2>My Movies Reviews</h2>
        <p>These are your latest movie ratings and comments.</p>
        {loading ? (
          <p>Loading…</p>
        ) : reviews.length === 0 ? (
          <p>You don't have reviews yet.</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-content">
                  <h3>{review.movieTitle || review.movieId}</h3>
                  {editingId === review.id ? (
                    <>
                      <div className="rating" aria-label="Edit rating">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`rating-star ${(editRating || 0) >= n ? "active" : ""}`}
                            onClick={() => setEditRating(n)}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea rows={3} value={editText} onChange={(e) => setEditText(e.target.value)} />
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button className="btn" onClick={saveEdit} disabled={!editText.trim() || editRating === ""}>
                          Save
                        </button>
                        <button className="btn" style={{ background: "#555" }} onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="rating">⭐ {review.rating}/5</p>
                      <p className="comment">"{review.text}"</p>
                      <p className="author">{new Date(review.createdAt).toLocaleDateString()}</p>
                      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        <Link className="btn" to={`/player/${review.movieId}`}>Go to Movie</Link>
                        <button className="btn" onClick={() => beginEdit(review)}>Edit</button>
                        <button className="btn" onClick={() => handleDelete(review.id)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviewsScreen;
