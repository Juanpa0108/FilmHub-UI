import { useNavigate } from "react-router-dom";
import useAuth from "../../API/auth";
import type { Movie } from "../../types/movie"; // ajusta el path si usas alias "@"
import "./movieResult.css";

type MovieResultProps = {
  movie: Movie; // si puede venir nulo, usa Movie | null y deja el guard
};

export default function MovieResult({ movie }: MovieResultProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!movie) return null;

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
      <button className="movie-result-btn" onClick={handleClick} aria-label={`Open ${movie.title}`}>
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
      </button>
    </li>
  );
}
