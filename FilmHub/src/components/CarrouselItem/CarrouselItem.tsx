// src/components/CarrouselItem/CarrouselItem.tsx

import type { Movie } from "../../types/movie";
import "../../screens/carrouselScreen/carrouselScreen.css";

/**
 * Reduced movie type used specifically for the carousel component.
 * Includes only the properties necessary for display.
 *
 * - `id`: unique movie identifier.
 * - `backgroundImage`: background image displayed when selected.
 * - `thumbnailImage`: thumbnail shown in the carousel.
 * - `alt`: alternative text for accessibility.
 * - `title` and `titleImage`: optional for flexibility.
 */
type MovieForCarousel =
  Pick<Movie, "id" | "backgroundImage" | "thumbnailImage" | "alt"> &
  Partial<Pick<Movie, "title" | "titleImage">>;

/**
 * Props for the `CarrouselItem` component.
 *
 * @property {MovieForCarousel} movie - Object containing basic movie information.
 * @property {(backgroundImage: string, id: string | number) => void} onMovieSelect -
 * Function triggered when the user clicks on the movie.
 * Passes the movie's background image and ID to the parent component.
 */
type CarrouselItemProps = {
  movie: MovieForCarousel;
  onMovieSelect: (backgroundImage: string, id: string | number) => void;
};

/**
 * `CarrouselItem` Component
 *
 * Displays a single movie thumbnail inside the carousel.
 * When clicked, it calls the `onMovieSelect` handler to update
 * the active background and selected movie in the parent component.
 *
 * @component
 * @example
 * ```tsx
 * <CarrouselItem
 *   movie={{
 *     id: 1,
 *     backgroundImage: "/images/bg1.jpg",
 *     thumbnailImage: "/images/thumb1.jpg",
 *     alt: "Inception"
 *   }}
 *   onMovieSelect={(bg, id) => console.log(bg, id)}
 * />
 * ```
 */
export default function CarrouselItem({ movie, onMovieSelect }: CarrouselItemProps) {
  return (
    <div
      className="carousel-item"
      data-id={movie.id}
      data-testid={`carousel-item-${movie.id}`}
      onClick={() => onMovieSelect(movie.backgroundImage, movie.id)}
    >
      <img
        src={movie.thumbnailImage ?? "/placeholder.jpg"} // fallback image if missing
        alt={movie.id?.toString() ?? movie.alt ?? "movie"} // accessible alt text
      />
    </div>
  );
}
