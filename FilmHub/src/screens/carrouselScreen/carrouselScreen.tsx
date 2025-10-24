// src/screens/carrouselScreen/CarrouselScreen.tsx
import "./carrouselScreen.css";
import "materialize-css/dist/css/materialize.min.css";
import { useState, useEffect } from "react";
import { moviesData } from "./movieData";
import MovieBanner from "../../components/MovieBanner/MovieBanner";
import MovieCarousel from "../../components/MovieCarrousel/MovieCarrousel";
import type { Movie } from "../../types/movie";

export default function CarrouselScreen() {
  // Keep the original 5 from movieData intact
  const movies = moviesData as Movie[];
  const defaultMovie = movies[0] as Movie;
  const [backgroundImage, setBackgroundImage] = useState<string>(
    `/movie/movie-website-landing-page-images/movies/${defaultMovie.backgroundImage}`
  );
  const [activeMovieId, setActiveMovieId] = useState<Movie["id"]>(defaultMovie.id);

  const handleMovieSelect = (bgImage: string, movieId: Movie["id"]) => {
    const bg = bgImage.startsWith("http") || bgImage.startsWith("/")
      ? bgImage
      : `/movie/movie-website-landing-page-images/movies/${bgImage}`;
    setBackgroundImage(bg);
    setActiveMovieId(movieId);
  };

  const handleReviewClick = (movieId: Movie["id"]) => {
    console.log(`Go to reviews for ${movieId}`);
  };

  const handleAddToList = (movieId: Movie["id"]) => {
    console.log(`Added ${movieId} to list`);
  };

  useEffect(() => {
    setBackgroundImage(
      `/movie/movie-website-landing-page-images/movies/${defaultMovie.backgroundImage}`
    );
  }, [defaultMovie.backgroundImage]);

  return (
    <div className="carrousel-screen" data-testid="carrousel-screen">
      <div className="carrousel-container">
        <header />
        <MovieBanner
          /* role="movie-banner"  <-- ❌ (no es prop válida) */
          data-testid="movie-banner"           /* ✅ si lo necesitas para tests */
          backgroundImage={backgroundImage}
          movies={movies}
          activeMovieId={activeMovieId}
          onReviewClick={handleReviewClick}
          onAddToList={handleAddToList}
        >
          <MovieCarousel
            /* role="movie-carousel" <-- ❌ */
            data-testid="movie-carousel"         /* ✅ */
            movies={movies}
            onMovieSelect={handleMovieSelect}
          />
        </MovieBanner>
      </div>
    </div>
  );
}
