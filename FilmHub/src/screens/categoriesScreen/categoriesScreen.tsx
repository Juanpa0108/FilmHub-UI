// src/screens/categoriesScreen/CategoriesScreen.tsx

/**
 * MovieDetail (Categories & Detail Dual-Mode) Screen
 * --------------------------------------------------
 * This screen serves two purposes depending on the presence of the `:id` route parameter:
 *
 * 1️⃣ **Categories mode** (no `:id` param):
 *     - Displays a grid of all available movie genres.
 *
 * 2️⃣ **Movie detail mode** (`:id` param provided and matches a movie):
 *     - Shows detailed information about the selected movie.
 *     - Includes a form to submit reviews and comments.
 *
 * Common features:
 *  - Global navigation bar with search and user authentication menu.
 *  - Sticky “Back” button for easy navigation.
 *  - Uses local movie data (`moviesData`) for movie metadata.
 */

import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { moviesData } from "../carrouselScreen/movieData";
import { Movie } from "../../types/movie";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import Searchbar from "../../components/SearchBar/Searchbar";
import OverlayPortal from "../../components/OverlayPortal/OverlayPortal";
import { useAuthContext } from "../../API/authContext";
import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import "./categoriesScreen.css";
import { apiPath } from "../../config/env";

/** Type definition for a single user comment. */
type UserComment = {
  id: number;
  text: string;
  rating: number;
  date: string;
};

/**
 * Main functional component for displaying either
 * the list of categories or a movie detail view.
 */
const MovieDetail: React.FC = () => {
  /** Extracts the :id parameter from the route (if present). */
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /** Finds the movie that matches the given :id param, if any. */
  const movie: Movie | undefined = id
    ? moviesData.find((m) => String(m.id) === id)
    : undefined;

  /** User-entered text for the review form. */
  const [comment, setComment] = useState<string>("");

  /** Selected rating value (1–5 stars). */
  const [rating, setRating] = useState<number>(5);

  /** List of submitted comments (local state only). */
  const [comments, setComments] = useState<UserComment[]>([]);

  // ------------------------------
  // 🔐 AUTH STATE & NAVBAR HANDLERS
  // ------------------------------
  const { state } = useAuthContext() as any;
  const user = state?.user;
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const [userPos, setUserPos] = useState<{ top: number; right: number } | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const userBtnRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Handles closing of user dropdown menu when clicking outside
   * or pressing the Escape key.
   */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Element | null;
      if (target && target.closest && target.closest('.nav-overlay')) return;
      if (!userMenuOpen) return;
      const node = target as Node | null;
      if (userMenuRef.current && node && !userMenuRef.current.contains(node)) {
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

  // Calculate overlay positions relative to trigger buttons when opened
  useEffect(() => {
    const calcRight = (rect: DOMRect) => Math.max(8, window.innerWidth - rect.right);
    if (menuAbierto && menuBtnRef.current) {
      const r = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: Math.round(r.bottom + 8), right: Math.round(calcRight(r)) });
    } else {
      setMenuPos(null);
    }
    if (userMenuOpen && userBtnRef.current) {
      const r = userBtnRef.current.getBoundingClientRect();
      setUserPos({ top: Math.round(r.bottom + 8), right: Math.round(calcRight(r)) });
    } else {
      setUserPos(null);
    }
    function onResize() {
      if (menuAbierto && menuBtnRef.current) {
        const r = menuBtnRef.current.getBoundingClientRect();
        setMenuPos({ top: Math.round(r.bottom + 8), right: Math.round(calcRight(r)) });
      }
      if (userMenuOpen && userBtnRef.current) {
        const r = userBtnRef.current.getBoundingClientRect();
        setUserPos({ top: Math.round(r.bottom + 8), right: Math.round(calcRight(r)) });
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [menuAbierto, userMenuOpen]);

  // ------------------------------
  // 📺 MOVIE DETAIL VIEW STATE
  // ------------------------------
  const isDetail = Boolean(id && movie);
  const bgUrl =
    isDetail && movie?.backgroundImage
      ? `/movie/movie-website-landing-page-images/${movie.backgroundImage}`
      : "";

  // ------------------------------
  // 📝 REVIEW SUBMISSION HANDLER
  // ------------------------------
  /**
   * Handles form submission for adding a new review.
   * Sends a POST request to the backend API (if available),
   * or falls back to adding a local comment entry.
   */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !movie) return;

    try {
      const token = (state as any)?.accessToken || localStorage.getItem("accessToken");
      const res = await fetch(apiPath("/api/reviews"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          movieId: String(movie.id),
          movieTitle: movie.title,
          rating,
          text: comment.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");
      const data = await res.json();
      const r = data.review;

      // Append new review to comment list
      setComments((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: r?.text || comment.trim(),
          rating: r?.rating || rating,
          date: new Date().toLocaleDateString(),
        },
      ]);

      // Reset form
      setComment("");
      setRating(5);
    } catch {
      // Fallback (offline or backend error)
      setComments((prev) => [
        ...prev,
        { id: Date.now(), text: comment.trim(), rating, date: new Date().toLocaleDateString() },
      ]);
      setComment("");
      setRating(5);
    }
  };

  /** Controlled select input for changing rating. */
  const handleRatingChange: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    setRating(Number(e.currentTarget.value));

  /** Controlled textarea input for changing comment text. */
  const handleCommentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setComment(e.currentTarget.value);

  // ------------------------------
  // 🧭 RENDER
  // ------------------------------
  return (
    <div className="app-container categories-page">
      {/* 🌐 Global Navigation Bar */}
      <div className="navbar">
        <div className="brand">
          <Link to="/" className="logo-link">
            <BrandLogo className="logo" />
          </Link>
        </div>

        <div className="header">
          <Searchbar />

          {/* ☰ Main menu */}
          <div className="menu-container">
            <button className="menu-button" ref={menuBtnRef} onClick={() => setMenuAbierto(!menuAbierto)}>
              ☰
            </button>
            {menuAbierto && (
              <OverlayPortal className="dropdown-menu nav-overlay" style={menuPos ?? undefined}>
                <Link to="/categories">Categories</Link>
                <Link to="/my-reviews">My Reviews</Link>
                <Link to="/favorites">Favorites</Link>
              </OverlayPortal>
            )}
          </div>

          {/* 🔐 Authentication / User Menu */}
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
                  onClick={() => setUserMenuOpen((v) => !v)}
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

      {/* 🔙 Sticky back button */}
      <button className="back-button page-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Conditional rendering: Detail view or Categories list */}
      {isDetail ? (
        /* 🎬 Movie Detail Section */
        <div
          className="movie-detail-container"
          style={{ backgroundImage: isDetail ? `url(${bgUrl})` : "none" }}
        >
          <div className="movie-overlay">
            <img
              src={movie!.titleImage}
              alt={movie!.alt ?? movie!.title}
              className="movie-title-img"
            />
            <h1>{movie!.title}</h1>

            <div className="movie-info">
              <p>
                <strong>Year:</strong> {movie!.year ?? "—"}
              </p>
              <p>
                <strong>Duration:</strong> {movie!.duration ?? "—"}
              </p>
              <p>
                <strong>Rating:</strong> {movie!.rating ?? "—"}
              </p>
              <p>
                <strong>Genre:</strong> {movie!.genre ?? "—"}
              </p>
            </div>

            <div className="movie-description">{movie!.description ?? ""}</div>

            {/* 💬 Comments Section */}
            <div className="comments-section">
              <h2>Reviews and Comments</h2>
              <form onSubmit={handleSubmit} className="comment-form">
                <label htmlFor="rating">Your rating:</label>
                <select
                  id="rating"
                  value={rating}
                  onChange={handleRatingChange}
                  className="rating-select"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} star{num !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <textarea
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Write your comment..."
                  rows={4}
                  required
                />
                <button type="submit">Submit</button>
              </form>

              {/* Render submitted comments */}
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p>No comments yet.</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="comment">
                      <p className="stars">
                        {"★".repeat(c.rating)}
                        {"☆".repeat(5 - c.rating)}
                      </p>
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
        /* 🗂️ Categories Section */
        <section className="categories-section">
          <h2>Categories</h2>
          <p>Browse the genres available in FilmHub</p>
          <div className="categories-grid">
            {[...new Set(moviesData.map((m) => m.genre))]
              .filter(Boolean)
              .map((g, i) => (
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
