// src/components/MovieContent/MovieContent.tsx
import "../../screens/carrouselScreen/carrouselScreen.css";
import type { Movie } from "../../types/movie"; // 👈 usa el tipo centralizado

type MovieContentProps = {
  movie: Movie;
  isActive: boolean;
  onReviewClick: (id: string | number) => void;
  onAddToList: (id: string | number) => void;
};

export default function MovieContent({
  movie,
  isActive,
  onReviewClick,
  onAddToList,
}: MovieContentProps) {
  return (
    <div
      className={`content ${movie.id} ${isActive ? "active" : ""}`}
      data-testid={`movie-content-${movie.id}`}
    >
      <img
        src={movie.titleImage ?? movie.thumbnailImage ?? "/placeholder.jpg"} // 👈 fallback opcional
        alt={movie.title}
        className="movie-title-image"
      />

      <h4 className="movie-title">
        <span>{movie.year}</span>
        <span>
          <i>{movie.rating}</i>
        </span>
        <span>{movie.duration}</span>
        <span>{movie.genre}</span>
      </h4>

      <p className="movie-description">{movie.description}</p>

      <div className="button">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onReviewClick(movie.id);
          }}
        >
          <i className="fa fa-play" aria-hidden="true" /> Reviews
        </a>

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
