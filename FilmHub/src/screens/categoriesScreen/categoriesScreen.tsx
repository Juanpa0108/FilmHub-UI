/**
 * Categories and Movie Detail (dual-mode) screen
 * - When no :id param is provided, shows a simple list of categories
 * - When :id is present and matches a local movie, shows its detail with comments form
 * - Uses global navbar and sticky back button
 */
import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { moviesData } from "../carrouselScreen/movieData";
import { Movie } from "../../types/movie";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import Searchbar from "../../components/SearchBar/Searchbar";
import { useAuthContext } from "../../API/authContext";
import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import "./categoriesScreen.css";
import { apiPath } from "../../config/env";

type UserComment = { id: number; text: string; rating: number; date: string };

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movie: Movie | undefined = id ? moviesData.find((m) => String(m.id) === id) : undefined;

  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState<UserComment[]>([]);
  
  // Navbar auth state
  const { state } = useAuthContext() as any;
  const user = state?.user;
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

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

  const isDetail = Boolean(id && movie);
  const bgUrl = isDetail && movie?.backgroundImage
    ? `/movie/movie-website-landing-page-images/${movie.backgroundImage}`
    : "";

  // Submit a review for the selected movie (only in detail mode)
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !movie) return;
    try {
      const token = (state as any)?.accessToken || localStorage.getItem('accessToken');
      const res = await fetch(apiPath('/api/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          movieId: String(movie.id),
          movieTitle: movie.title,
          rating,
          text: comment.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      const data = await res.json();
      const r = data.review;
      setComments((prev) => [
        ...prev,
        { id: Date.now(), text: r?.text || comment.trim(), rating: r?.rating || rating, date: new Date().toLocaleDateString() },
      ]);
      setComment('');
      setRating(5);
    } catch (_) {
      // fallback UI only, keep previous behavior
      setComments((prev) => [
        ...prev,
        { id: Date.now(), text: comment.trim(), rating, date: new Date().toLocaleDateString() },
      ]);
      setComment('');
      setRating(5);
    }
  };

  // Controlled select for rating
  const handleRatingChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setRating(Number(e.currentTarget.value));
  };

  // Controlled textarea for text
  const handleCommentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setComment(e.currentTarget.value);
  };

  return (
    <div className="app-container categories-page">
      {/* Global navbar (full width, outside overlay) */}
      <div className="navbar">
          <div className="brand">
            <Link to="/" className="logo-link">
              <BrandLogo className="logo" />
            </Link>
          </div>
          <div className="header">
            <Searchbar />
            <div className="menu-container">
              <button className="menu-button" onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
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
                      <Link className="user-item" to="/profile" role="menuitem" onClick={() => setUserMenuOpen(false)}>Profile</Link>
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

      <button className="back-button page-back" onClick={() => navigate(-1)}>← Back</button>

      {isDetail ? (
        <div className="movie-detail-container" style={{ backgroundImage: isDetail ? `url(${bgUrl})` : "none" }}>
          <div className="movie-overlay">
            <img src={movie!.titleImage} alt={movie!.alt ?? movie!.title} className="movie-title-img" />
            <h1>{movie!.title}</h1>
            <div className="movie-info">
              <p><strong>Year:</strong> {movie!.year ?? "—"}</p>
              <p><strong>Duration:</strong> {movie!.duration ?? "—"}</p>
              <p><strong>Rating:</strong> {movie!.rating ?? "—"}</p>
              <p><strong>Genre:</strong> {movie!.genre ?? "—"}</p>
            </div>
            <div className="movie-description">{movie!.description ?? ""}</div>
            <div className="comments-section">
              <h2>Reviews and Comments</h2>
              <form onSubmit={handleSubmit} className="comment-form">
                <label htmlFor="rating">Your rating:</label>
                <select id="rating" value={rating} onChange={handleRatingChange} className="rating-select">
                  {[1,2,3,4,5].map((num) => (
                    <option key={num} value={num}>{num} star{num !== 1 ? "s" : ""}</option>
                  ))}
                </select>
                <textarea value={comment} onChange={handleCommentChange} placeholder="Write your comment..." rows={4} required />
                <button type="submit">Submit</button>
              </form>
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p>No comments yet.</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="comment">
                      <p className="stars">{"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}</p>
                      <p>{c.text}</p>
                      <small>{c.date}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <section className="categories-section">
          <h2>Categories</h2>
          <p>Browse the genres available in FilmHub</p>
          <div className="categories-grid">
            {[...new Set(moviesData.map(m => m.genre))].filter(Boolean).map((g, i) => (
              <div key={i} className="category-card">
                <span className="category-name">{g}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
