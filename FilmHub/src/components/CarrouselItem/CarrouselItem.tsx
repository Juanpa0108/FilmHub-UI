// src/components/CarrouselItem/CarrouselItem.tsx
import type { Movie } from "../../types/movie";           // 👈 usa el tipo central
import "../../screens/carrouselScreen/carrouselScreen.css";
// Acepta solo el subconjunto que necesita este componente:
type MovieForCarousel =
  Pick<Movie, "id" | "backgroundImage" | "thumbnailImage" | "alt">
  & Partial<Pick<Movie, "title" | "titleImage">>; // opcionales si algún día los pasas

type CarrouselItemProps = {
  movie: MovieForCarousel;
  onMovieSelect: (backgroundImage: string, id: string | number) => void;
};

export default function CarrouselItem({ movie, onMovieSelect }: CarrouselItemProps) {
  return (
    <div
      className="carousel-item"
      data-testid={`carousel-item-${movie.id}`}
      onClick={() => onMovieSelect(movie.backgroundImage, movie.id)}
    >
      <img src={movie.thumbnailImage ?? "/placeholder.jpg"} alt={movie.alt ?? "movie"} />
    </div>
  );
}
