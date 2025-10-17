// src/screens/carrouselScreen/CarrouselScreen.tsx
import "./carrouselScreen.css";
import "materialize-css/dist/css/materialize.min.css";
import { useState, useEffect } from "react";
import { moviesData } from "./movieData";
import MovieBanner from "../../components/MovieBanner/MovieBanner";
import MovieCarousel from "../../components/MovieCarrousel/MovieCarrousel";
import type { Movie } from "../../types/movie";

export default function CarrouselScreen() {
  // tipamos el dataset (ideal: que movieData lo exporte ya como Movie[])
  const defaultMovie = moviesData[0] as Movie;

  const [backgroundImage, setBackgroundImage] = useState<string>(
    `/movie/movie-website-landing-page-images/movies/${defaultMovie.backgroundImage}`
  );
  const [activeMovieId, setActiveMovieId] = useState<Movie["id"]>(defaultMovie.id);

  const handleMovieSelect = (bgImage: string, movieId: Movie["id"]) => {
    setBackgroundImage(`/movie/movie-website-landing-page-images/movies/${bgImage}`);
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
          movies={moviesData as Movie[]}
          activeMovieId={activeMovieId}
          onReviewClick={handleReviewClick}
          onAddToList={handleAddToList}
        >
          <MovieCarousel
            /* role="movie-carousel" <-- ❌ */
            data-testid="movie-carousel"         /* ✅ */
            movies={moviesData as Movie[]}
            onMovieSelect={handleMovieSelect}
          />
        </MovieBanner>
      </div>
    </div>
  );
}
