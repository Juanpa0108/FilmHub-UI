import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie"; // ajusta el path si usas alias "@"
import "./movieResult.css";

type MovieResultProps = {
  movie: Movie; // si puede venir nulo, usa Movie | null y deja el guard
};

export default function MovieResult({ movie }: MovieResultProps) {
  if (!movie) return null;

  return (
    <Link to={`/movie/${movie.id}`} className="movie-result-link">
      <li className="movie-result" role="listitem">
        <div className="movie-poster">
          <img
            src={movie.thumbnailImage ?? "/placeholder-image.jpg"}
            alt={movie.alt || movie.title || "Movie poster"}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const img = e.currentTarget;
              img.onerror = null; // evita bucle si el placeholder falla
              img.src = "/placeholder-image.jpg";
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
}
