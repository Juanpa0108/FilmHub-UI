/**
 * MovieContent.tsx
 * 
 * This component displays detailed information about a movie inside the carousel screen.
 * It includes the movie's title, description, metadata (year, rating, duration, genre),
 * and interactive buttons for watching or adding to the user’s list.
 * 
 * @module MovieContent
 */

import "../../screens/carrouselScreen/carrouselScreen.css";
import type { Movie } from "../../types/movie";
import { useNavigate } from "react-router-dom";

/**
 * Props type definition for the MovieContent component.
 */
type MovieContentProps = {
  /** Movie object containing all details to display */
  movie: Movie;

  /** Indicates whether this movie content is currently active in the carousel */
  isActive: boolean;

  /** Callback triggered when the user wants to see or write a review */
  onReviewClick: (id: string | number) => void;

  /** Callback triggered when the user adds the movie to their list */
  onAddToList: (id: string | number) => void;
};

/**
 * MovieContent Component
 * 
 * Displays movie details including title, year, rating, and description.
 * Also provides actions for watching the movie and adding it to a personal list.
 * 
 * @param {MovieContentProps} props - Component properties
 * @returns {JSX.Element} The rendered movie content block
 */
export default function MovieContent({
  movie,
  isActive,
  onReviewClick,
  onAddToList,
}: MovieContentProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`content ${movie.id} ${isActive ? "active" : ""}`}
      data-testid={`movie-content-${movie.id}`}
    >
      {/* Movie Image (Title or Thumbnail) */}
      <img
        src={movie.titleImage ?? movie.thumbnailImage ?? "/placeholder.jpg"}
        alt={movie.title}
        className="movie-title-image"
      />

      {/* Movie Metadata */}
      <h4 className="movie-title">
        <span>{movie.year}</span>
        <span>
          <i>{movie.rating}</i>
        </span>
        <span>{movie.duration}</span>
        <span>{movie.genre}</span>
      </h4>

      {/* Movie Description */}
      <p className="movie-description">{movie.description}</p>

      {/* Action Buttons */}
      <div className="button">
        {/* 🎥 Watch Now: navigates to the player page using the movie ID */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/player/${movie.id}`);
          }}
        >
          <i className="fa fa-play" aria-hidden="true" /> Watch Now
        </a>

        {/* ➕ Add to My List: triggers the add-to-list handler */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onAddToList(movie.id);
          }}
        >
          <i className="fa fa-plus" aria-hidden="true" /> My List
        </a>
      </div>
    </div>
  );
}
