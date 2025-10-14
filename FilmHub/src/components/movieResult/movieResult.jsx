import React from "react";
import { Link } from "react-router-dom";
import "./movieResult.css";

const MovieResult = ({ movie }) => {
  // Validación de props para evitar errores
  if (!movie) {
    return null;
  }

  return (
    <Link to={`/movie/${movie.id}`} className="movie-result-link">
      <li className="movie-result" role="listitem">
        <div className="movie-poster">
          <img 
            src={movie.thumbnailImage} 
            alt={movie.alt || movie.title || "Movie poster"} 
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg"; // Imagen de fallback
            }}
          />
        </div>
        <div className="movie-result-content">
          <h2 className="movie-result-title">{movie.title}</h2>
          <p className="movie-result-info">{movie.year}</p>
          <div className="movie-result-rating">
            <span className="result-stars">★★★★★</span>
          </div>
        </div>
      </li>
    </Link>
  );
};

export default MovieResult;