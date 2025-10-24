/**
 * MovieBanner Component
 * ---------------------
 * Displays a dynamic movie banner with background image and movie details.
 * It renders a list of MovieContent components and manages interactions such as
 * "Add to List" and "Review" actions for the currently active movie.
 *
 * Dependencies:
 * - React
 * - MovieContent (child component that displays movie details)
 * - Movie type definition (from types/movie)
 *
 * Props:
 * @prop {string} backgroundImage - URL of the banner background image.
 * @prop {Movie[]} movies - List of movies to display in the banner.
 * @prop {string | number} activeMovieId - ID of the currently active movie.
 * @prop {(id: string | number) => void} onReviewClick - Handler for review button clicks.
 * @prop {(id: string | number) => void} onAddToList - Handler for "Add to List" button clicks.
 * @prop {ReactNode} [children] - Optional elements to render inside the banner (e.g., overlays, buttons).
 */

import MovieContent from "../MovieContent/MovieContent";
import "../../screens/carrouselScreen/carrouselScreen.css";
import type { Movie } from "../../types/movie";
import type { ReactNode } from "react";

// Define a reusable type for movie action callbacks
type OnMovieAction = (id: string | number) => void;

/**
 * Functional component that renders a full-width movie banner
 * with dynamic content and user interaction handlers.
 */
export default function MovieBanner({
  backgroundImage,
  movies,
  activeMovieId,
  onReviewClick,
  onAddToList,
  children,
}: {
  backgroundImage: string;
  movies: Movie[];
  activeMovieId: string | number;
  onReviewClick: OnMovieAction;
  onAddToList: OnMovieAction;
  children?: ReactNode;
}) {
  return (
    /**
     * Main banner container.
     * The background dynamically changes according to the selected movie.
     */
    <div
      className="banner"
      role="banner"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/** Render all MovieContent components and highlight the active one */}
      {movies.map((movie) => (
        <MovieContent
          key={movie.id}
          movie={movie}
          isActive={activeMovieId === movie.id}
          onReviewClick={onReviewClick}
          onAddToList={onAddToList}
        />
      ))}

      {/** Render optional elements passed as children (e.g., buttons, overlays) */}
      {children}
    </div>
  );
}
