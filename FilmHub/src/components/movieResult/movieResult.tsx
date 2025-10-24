/**
 * MovieResult.tsx
 *
 * This component displays a single movie item in a list of search results or recommendations.
 * It shows the movie poster, title, release year, and a simple rating placeholder.
 * When clicked, it redirects the user either to the movie details page or to the login page
 * if the user is not authenticated.
 *
 * @module MovieResult
 */

import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../API/authContext";
import type { Movie } from "../../types/movie";
import "./movieResult.css";

/**
 * Props type definition for the MovieResult component.
 */
type MovieResultProps = {
  /** Movie object containing the movie’s basic information */
  movie: Movie;
};

/**
 * MovieResult Component
 *
 * Renders a clickable movie item that displays its thumbnail, title, and release year.
 * If the user is logged in, clicking navigates to the movie’s detail page (`/movie/:id`).
 * Otherwise, it redirects to the login screen.
 *
 * @param {MovieResultProps} props - Component properties
 * @returns {JSX.Element | null} The rendered movie item or null if no movie is provided
 */
export default function MovieResult({ movie }: MovieResultProps) {
  const navigate = useNavigate();
  const { state } = useAuthContext() as any;
  const user = state?.user;

  // If movie is not provided, do not render anything
  if (!movie) return null;

  /**
   * Handles the click event on the movie item.
   * - If the user is authenticated → navigates to `/movie/:id`
   * - Otherwise → redirects to `/login`
   */
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate(`/movie/${movie.id}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <li className="movie-result" role="listitem">
      <button
        className="movie-result-btn"
        onClick={handleClick}
        aria-label={`Open ${movie.title}`}
      >
        {/* Movie Poster */}
        <div className="movie-poster">
          <img
            src={movie.thumbnailImage ?? "/placeholder-image.jpg"}
            alt={movie.alt || movie.title || "Movie poster"}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const img = e.currentTarget;
              img.onerror = null; // Prevent infinite loop if the placeholder fails
              img.src = "/placeholder-image.jpg";
            }}
          />
        </div>

        {/* Movie Info */}
        <div className="movie-result-content">
          <h2 className="movie-result-title">{movie.title}</h2>
          <p className="movie-result-info">{movie.year}</p>

          {/* Static rating placeholder — replace with dynamic rating logic if available */}
          <div className="movie-result-rating">
            <span className="result-stars">★★★★★</span>
          </div>
        </div>
      </button>
    </li>
  );
}
