/**
 * Movie Detail screen
 * - Shows a single movie with background/title images and basic info
 * - Displays average rating calculated from fetched reviews and the synopsis
 * - Allows authenticated users to add a new review (rating + text)
 * - Integrates with Favorites context to add/remove movie from favorites
 * - Uses a global navbar and a consistent sticky back button
 */
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { moviesData } from "../carrouselScreen/movieData";
import { Movie } from "../../types/movie";
import { useFavorites } from "../../API/favoritesContext";
import { useAuthContext } from "../../API/authContext";
import { apiPath } from "../../config/env";
import "./movieDetail.css";
import { fetchMovieById } from "../../API/movies";
import Searchbar from "../../components/SearchBar/Searchbar";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "../../components/LogoutButton/LogoutButton";

type UserComment = {
  id: string;
  text: string;
  rating: number;
  date: string;
  mine?: boolean;
};

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | undefined>(() =>
    moviesData.find((m) => String(m.id) === id)
  );
  const { toggle, has } = useFavorites();
  const { state } = useAuthContext() as any;
  const user = state?.user;
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Review composer state
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number | "">("");
  // Reviews loaded from API (and live-updated on submit/delete)
  const [comments, setComments] = useState<UserComment[]>([]);
  // Hover-only visual state for star input
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
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
  // Load movie data (API when id looks like MongoId), then load reviews for this movie
  (async () => {
      if (!id) return;
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
      if (isMongoId) {
        try {
          const fromApi = await fetchMovieById(id);
          if (mounted && fromApi) setMovie(fromApi);
        } catch { /* ignore */ }
      }

      try {
        const res = await fetch(apiPath(`/api/reviews?movieId=${encodeURIComponent(String(id))}`), { credentials: 'include' });
        const data = await res.json();
        const tokenUserId = (state as any)?.user?.id ? String((state as any).user.id) : undefined;
        const items: UserComment[] = (data.reviews || []).map((r: any) => ({
          id: r._id,
          text: r.text,
          rating: r.rating,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          mine: tokenUserId ? String(r.user) === tokenUserId : false,
        }));
        if (mounted) setComments(items);
      } catch { /* ignore */ }
    })();
    return () => {
      mounted = false;
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [id, userMenuOpen]);

  if (!movie) {
    return <h2 className="not-found">🎬 Movie not found</h2>;
  }

  const IMG_BASE = "/movie/movie-website-landing-page-images/movies/";
  const bgUrl = movie.backgroundImage.startsWith("http")
    ? movie.backgroundImage
    : movie.backgroundImage.startsWith("/")
      ? movie.backgroundImage
      : IMG_BASE + movie.backgroundImage;
  const titleUrl = movie.titleImage.startsWith("http")
    ? movie.titleImage
    : movie.titleImage.startsWith("/")
      ? movie.titleImage
      : IMG_BASE + movie.titleImage;

  /**
   * Submit a new review for the current movie.
   * Requires authentication; on success, appends to the local comments list to update the UI immediately.
   */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !movie || rating === "" || rating < 1 || rating > 5) return;
    try {
      const token = state?.accessToken || localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in to post a review.");
        return;
      }
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
      const created = data?.review;
      const newComment: UserComment = {
        id: created?._id || String(Date.now()),
        text: created?.text || comment.trim(),
        rating: created?.rating || rating,
        date: created?.createdAt ? new Date(created.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        mine: true,
      };
      setComments((prev) => [...prev, newComment]);
      setComment("");
      setRating("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      alert(msg);
    }
  };

  /** Delete one of the current user's reviews and update UI optimistically. */
  const handleDelete = async (reviewId: string) => {
    try {
      const token = state?.accessToken || localStorage.getItem("accessToken");
      const res = await fetch(apiPath(`/api/reviews/${encodeURIComponent(reviewId)}`), {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setComments((prev) => prev.filter((c) => c.id !== reviewId));
    } catch {
      // ignore
    }
  };

  return (
    <div className="app-container movie-detail-page">
      {/* Navbar */}
      <div className="navbar">
        <div className="brand">
          <Link to="/" className="logo-link"><BrandLogo className="logo" /></Link>
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
                <button className="user-avatar" onClick={() => setUserMenuOpen((v) => !v)}>
                  <FaUserCircle />
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-header">{user?.firstName || user?.username || user?.email}</div>
                    <Link className="user-item" to="/profile">Profile</Link>
                    <div className="user-item"><LogoutButton /></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back button */}
      <button className="back-button page-back" onClick={() => navigate(-1)}>← Back</button>

      {/* Movie content */}
      <div className="movie-detail-container">
        <img className="movie-bg" src={bgUrl} alt="" />
        <div className="movie-overlay">
          <img src={titleUrl} alt={movie.alt ?? movie.title} className="movie-title-img" />
          <h1>{movie.title}</h1>

          <div className="movie-info">
            <p><strong>Year:</strong> {movie.year ?? "—"}</p>
            <p><strong>Duration:</strong> {movie.duration ?? "—"}</p>
            <p><strong>Rating:</strong> {movie.rating ?? "—"}</p>
            <p><strong>Genre:</strong> {movie.genre ?? "—"}</p>
          </div>

          {/* Average rating + synopsis + actions */}
          {(() => {
            const count = comments.length;
            const avg = count ? comments.reduce((s, c) => s + c.rating, 0) / count : 0;
            const rounded = Math.round(avg);
            const stars = "★".repeat(rounded) + "☆".repeat(5 - rounded);
            return (
              <>
                <div className="avg-rating">
                  <span className="stars">{stars}</span>
                  <span className="value">{avg.toFixed(1)} / 5</span>
                  <span className="count">({count} {count === 1 ? "review" : "reviews"})</span>
                </div>

                {movie.description && (
                  <p className="movie-description">{movie.description}</p>
                )}

                <div className="actions-row">
                  <button
                    className="btn"
                    onClick={() => toggle(String(movie.id))}
                  >
                    {has(String(movie.id)) ? "Remove from Favorites" : "Add to Favorites"}
                  </button>
                  <Link className="btn btn-dark" to="/favorites">Go to Favorites</Link>
                </div>
              </>
            );
          })()}

          {/* Comments */}
          <div className="comments-section">
            <h2>Reviews and Comments</h2>
            <form onSubmit={handleSubmit} className="comment-form">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`rating-star ${(hoverRating ?? (rating || 0)) >= n ? "active" : ""}`}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(n)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                rows={4}
                required
              />
              <button type="submit" disabled={rating === "" || !comment.trim()}>Submit</button>
            </form>

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
                    {c.mine && (
                      <div className="inline-actions">
                        <button className="btn btn-dark" onClick={() => handleDelete(c.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
