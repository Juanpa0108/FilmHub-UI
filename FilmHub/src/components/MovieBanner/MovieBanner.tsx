// src/components/MovieBanner/MovieBanner.tsx
import MovieContent from "../MovieContent/MovieContent";
import "../../screens/carrouselScreen/carrouselScreen.css";
import type { Movie } from "../../types/movie"; // ✅ usa el tipo centralizado

type OnMovieAction = (id: string | number) => void;

type MovieBannerProps = {
  backgroundImage: string;
  movies: Movie[];
  activeMovieId: string | number;
  onReviewClick: OnMovieAction;
  onAddToList: OnMovieAction;
};

export default function MovieBanner({
  backgroundImage,
  movies,
  activeMovieId,
  onReviewClick,
  onAddToList,
}: MovieBannerProps) {
  return (
    <div
      className="banner"
      role="banner"
      style={{
        background: `url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {movies.map((movie) => (
        <MovieContent
          key={movie.id}
          movie={movie}
          isActive={activeMovieId === movie.id}
          onReviewClick={onReviewClick}
          onAddToList={onAddToList}
        />
      ))}
    </div>
  );
}
