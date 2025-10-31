import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import TopBar from "../../components/TopBar/TopBar";
import { moviesData } from "../../screens/carrouselScreen/movieData";
import { useAuthContext } from "../../API/authContext";
import { useFavorites } from "../../API/favoritesContext";
import { apiPath } from "../../config/env";
import "./PlayerScreen.css";
import "../movieDetail/movieDetail.css";

type UserComment = { id: string; text: string; rating: number; date: string; mine?: boolean };

const PlayerScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAuthContext() as any;
  const isAuthenticated = !!state?.user;
  const { toggle, has } = useFavorites();

  const movie = moviesData.find((m) => String(m.id) === String(id));

  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number | "">("");
  const [comments, setComments] = useState<UserComment[]>([]);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>("none");
  const playerRef = useRef<any>(null);

  // ✅ Validación inicial
  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
    else if (!movie) navigate("/", { replace: true });
  }, [isAuthenticated, movie, navigate]);

  // ✅ Cargar reseñas
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      try {
        const res = await fetch(apiPath(`/api/reviews?movieId=${encodeURIComponent(String(id))}`), {
          credentials: "include",
        });
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
      } catch (err) {
        console.warn("Failed to load reviews", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, state]);

  // ✅ Enviar reseña
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !movie || rating === "" || (typeof rating === "number" && (rating < 1 || rating > 5))) return;
    try {
      const token = state?.accessToken || localStorage.getItem("accessToken");
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
        rating: created?.rating || (typeof rating === "number" ? rating : 0),
        date: created?.createdAt ? new Date(created.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        mine: true,
      };
      setComments((prev) => [...prev, newComment]);
      setComment("");
      setRating("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Network error");
    }
  };

  // ✅ Subtítulos funcionales (sin error TS y activación correcta)
  const injectSubtitles = async (lang: string) => {
    const video = document.querySelector("video");
    if (!video) return console.warn("No video element found");

    // Limpia subtítulos previos
    video.querySelectorAll("track[data-injected]").forEach((t) => t.remove());

    if (lang === "none") {
      Array.from(video.textTracks).forEach((t) => (t.mode = "disabled"));
      return;
    }

    const src = lang === "es" ? movie?.subtitlesEs : movie?.subtitlesEn;
    if (!src) return console.warn("No subtitle URL found for", lang);

    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = lang === "es" ? "Español" : "English";
    track.srclang = lang;
    track.src = src;
    track.default = true;
    track.setAttribute("data-injected", "true");

    track.addEventListener("load", () => {
      const tracks = video.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i];
        if (t.language === lang || t.label.toLowerCase().includes(lang)) {
          t.mode = "showing";
        } else {
          t.mode = "disabled";
        }
      }
      console.log("✅ Subtítulos activados:", lang);
    });

    video.appendChild(track);
  };

  const handleSubtitleChange = (lang: string) => {
    setSelectedSubtitle(lang);
    injectSubtitles(lang);
  };

  const onPlayerReady = () => {
    injectSubtitles(selectedSubtitle);
  };

  if (!isAuthenticated || !movie) return null;

  const count = comments.length;
  const avg = count ? comments.reduce((s, c) => s + c.rating, 0) / count : 0;
  const rounded = Math.round(avg);
  const stars = "★".repeat(rounded) + "☆".repeat(5 - rounded);

  const IMG_BASE = "/movie/movie-website-landing-page-images/movies/";
  const titleUrl = movie?.titleImage
    ? movie.titleImage.startsWith("http")
      ? movie.titleImage
      : movie.titleImage.startsWith("/")
      ? movie.titleImage
      : IMG_BASE + movie.titleImage
    : undefined;

  return (
    <div className="player-container">
      <TopBar />

      <div className="player-wrapper full-cover">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

        <ReactPlayer
          ref={playerRef}
          className="react-player"
          src={movie.videoUrl}
          config={{
            file: { attributes: { crossOrigin: "anonymous", preload: "metadata", playsInline: true } },
          }}
          controls
          width="100%"
          height="100%"
          onReady={onPlayerReady}
        />

        {/* ✅ Botones de subtítulos visibles */}
        <div className="subtitle-buttons">
          {movie?.subtitlesEs && (
            <button
              className={selectedSubtitle === "es" ? "active" : ""}
              onClick={() => handleSubtitleChange("es")}
            >
              Español
            </button>
          )}
          {movie?.subtitlesEn && (
            <button
              className={selectedSubtitle === "en" ? "active" : ""}
              onClick={() => handleSubtitleChange("en")}
            >
              Inglés
            </button>
          )}
          <button
            className={selectedSubtitle === "none" ? "active" : ""}
            onClick={() => handleSubtitleChange("none")}
          >
            Sin Subtítulos
          </button>
        </div>
      </div>

      {/* ===== Detalles + comentarios ===== */}
      <section className="player-detail-section" style={{ padding: "24px 16px", background: "#000" }}>
        <div className="movie-overlay" style={{ maxWidth: 980, margin: "0 auto" }}>
          {titleUrl && <img src={titleUrl} alt={movie.alt ?? movie.title} className="movie-title-img" />}
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

          {/* Comentarios */}
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
              <button type="submit" disabled={rating === "" || !comment.trim()}>
                Submit
              </button>
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
      </section>
    </div>
  );
};

export default PlayerScreen;
