import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { moviesData } from "../carrouselScreen/movieData";
import { Movie } from "../../types/movie";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import "../movieDetail/movieDetail.css";

type UserComment = { id: number; text: string; rating: number; date: string };

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movie: Movie | undefined = moviesData.find((m) => String(m.id) === id);

  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState<UserComment[]>([]);

  if (!movie) {
    return <h2 style={{ padding: "2rem" }}>🎬 Movie not found</h2>;
  }

  // Asegúrate que el archivo exista en /public/movie/movie-website-landing-page-images/
  const bgUrl = `/movie/movie-website-landing-page-images/${movie.backgroundImage}`;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment: UserComment = {
      id: Date.now(),
      text: comment.trim(),
      rating,
      date: new Date().toLocaleDateString(),
    };

    setComments((prev) => [...prev, newComment]);
    setComment("");
    setRating(5);
  };

  const handleRatingChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setRating(Number(e.currentTarget.value));
  };

  const handleCommentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setComment(e.currentTarget.value);
  };

  return (
    <div className="movie-detail-container" style={{ backgroundImage: `url(${bgUrl})` }}>
      <div className="movie-overlay">
        <div className="movie-header-logo">
          <Link to="/" className="logo-link">
            <BrandLogo className="logo" />
          </Link>
          <Link to="/" className="brand-text-link">
            <h2 className="brand-title">
              Film <span className="brand-subtext">Hub</span>
            </h2>
          </Link>
        </div>

        <img
          src={movie.titleImage}                 // si viene de /public, usa ruta absoluta: "/images/..."
          alt={movie.alt ?? movie.title}
          className="movie-title-img"
        />
        <h1>{movie.title}</h1>

        <div className="movie-info">
          <p><strong>Year:</strong> {movie.year ?? "—"}</p>
          <p><strong>Duration:</strong> {movie.duration ?? "—"}</p>
          <p><strong>Rating:</strong> {movie.rating ?? "—"}</p>
          <p><strong>Genre:</strong> {movie.genre ?? "—"}</p>
        </div>

        <div className="movie-description">{movie.description ?? ""}</div>

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
  );
};

export default MovieDetail;
