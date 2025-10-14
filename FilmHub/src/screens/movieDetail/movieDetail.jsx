import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { moviesData } from "../carrouselScreen/movieData";
import logo from "../../assets/logo.png";
import "./movieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const movie = moviesData.find((m) => m.id.toString() === id);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState([]);

  if (!movie) {
    return <h2 style={{ padding: "2rem" }}>🎬 Movie not found</h2>;
  }

  const bgUrl = `/movie/movie-website-landing-page-images/${movie.backgroundImage}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      text: comment,
      rating: Number(rating),
      date: new Date().toLocaleDateString(),
    };

    setComments([...comments, newComment]);
    setComment("");
    setRating(5);
  };

  return (
    <div
      className="movie-detail-container"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="movie-overlay">
        {/* Logo and brand */}
        <div className="movie-header-logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <Link to="/" className="brand-text-link">
            <h2 className="brand-title">
              Film <span className="brand-subtext">Hub</span>
            </h2>
          </Link>
        </div>

        <img
          src={movie.titleImage}
          alt={movie.alt}
          className="movie-title-img"
        />
        <h1>{movie.title}</h1>

        <div className="movie-info">
          <p><strong>Year:</strong> {movie.year}</p>
          <p><strong>Duration:</strong> {movie.duration}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>
          <p><strong>Genre:</strong> {movie.genre}</p>
        </div>

        <div className="movie-description">
          {movie.description}
        </div>

        {/* Comments */}
        <div className="comments-section">
          <h2>Reviews and Comments</h2>

          <form onSubmit={handleSubmit} className="comment-form">
            <label htmlFor="rating">Your rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
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
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              rows="4"
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
