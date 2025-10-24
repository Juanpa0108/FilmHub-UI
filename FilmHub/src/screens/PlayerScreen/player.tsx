import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import TopBar from "../../components/TopBar/TopBar";
import { moviesData } from "../../screens/carrouselScreen/movieData";
import { useAuthContext } from "../../API/authContext"; // 🔐 Import auth context
import { useFavorites } from "../../API/favoritesContext";
import { apiPath } from "../../config/env";
import "./PlayerScreen.css";
// Reuse detail styles for comments/ratings/synopsis
import "../movieDetail/movieDetail.css";

/**
 * PlayerScreen Component
 * ----------------------
 * - Displays a movie player for the selected movie (based on URL ID).
 * - Redirects to login if the user is not authenticated.
 */
type UserComment = { id: string; text: string; rating: number; date: string; mine?: boolean };

const PlayerScreen: React.FC = () => {
  // Get movie ID from the URL (e.g., /player/the-little-mermaid)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Access authentication state from global AuthContext
  const { state } = useAuthContext() as any;
  const isAuthenticated = !!state?.user; // Boolean check for logged-in user
  const { toggle, has } = useFavorites();

  // Find the movie by its ID from local dataset
  const movie = moviesData.find((m) => String(m.id) === String(id));

  // Comments state (shared logic with Movie Detail)
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number | "">("");
  const [comments, setComments] = useState<UserComment[]>([]);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  /**
   * useEffect:
   * - If user is not authenticated → redirect to /login
   * - If movie not found → redirect to home (/)
   */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true }); // 🔄 Replaces current history entry
    } else if (!movie) {
      navigate("/", { replace: true }); // Avoids back loop too
    }
  }, [isAuthenticated, movie, navigate]);

  // Load reviews for this movie
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
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
    return () => { mounted = false };
  }, [id, state]);

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
    } catch { /* ignore */ }
  };

  // Prevent rendering while redirecting (avoids flickering)
  if (!isAuthenticated || !movie) return null;

  // Average rating
  const count = comments.length;
  const avg = count ? comments.reduce((s, c) => s + c.rating, 0) / count : 0;
  const rounded = Math.round(avg);
  const stars = "★".repeat(rounded) + "☆".repeat(5 - rounded);

  return (
    <div className="player-container">
      {/*Top navigation bar */}
      <TopBar />

      {/*Movie player section */}
      <div className="player-wrapper full-cover">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Embedded YouTube video (local movieData) */}
        <ReactPlayer
          className="react-player"
          src={movie.videoUrl}
          config={{
            youtube: {
              playerVars: {
                origin: window.location.origin,
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
              },
              embedOptions: {
                host: 'https://www.youtube.com',
              },
            },
          }}
          controls
          playing
          width="100%"
          height="100%"
        />
      </div>

      {/* Details + comments below the player */}
      <section className="player-detail-section" style={{ padding: "24px 16px", background: "#000" }}>
        <div className="movie-overlay" style={{ maxWidth: 980, margin: "0 auto" }}>
          <h1 style={{ textAlign: "center", color: "#f1c40f", marginTop: 0 }}>{movie.title}</h1>
          <div className="movie-info">
            <p><strong>Year:</strong> {movie.year ?? "—"}</p>
            <p><strong>Duration:</strong> {movie.duration ?? "—"}</p>
            <p><strong>Rating:</strong> {movie.rating ?? "—"}</p>
            <p><strong>Genre:</strong> {movie.genre ?? "—"}</p>
          </div>

          <div className="avg-rating">
            <span className="stars">{stars}</span>
            <span className="value">{avg.toFixed(1)} / 5</span>
            <span className="count">({count} {count === 1 ? "review" : "reviews"})</span>
          </div>

          {movie.description && <p className="movie-description">{movie.description}</p>}

          <div className="actions-row">
            <button className="btn" onClick={() => toggle(String(movie.id))}>
              {has(String(movie.id)) ? "Remove from Favorites" : "Add to Favorites"}
            </button>
            <Link className="btn btn-dark" to="/favorites">Go to Favorites</Link>
          </div>

          <div className="comments-section">
            <h2>Reviews and Comments</h2>
            <form onSubmit={handleSubmit} className="comment-form">
              <div className="rating-stars">
                {[1,2,3,4,5].map((n) => (
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
                    <p className="stars">{"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}</p>
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
      </section>
    </div>
  );
};

export default PlayerScreen;
