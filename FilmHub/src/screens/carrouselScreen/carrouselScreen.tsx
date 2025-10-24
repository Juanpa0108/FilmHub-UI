// src/screens/carrouselScreen/CarrouselScreen.tsx

/**
 * CarrouselScreen Component
 * -------------------------
 * This screen displays a movie carousel and banner system for a movie website.
 * It showcases multiple movies with dynamic background transitions when users select
 * a different movie. The page layout is composed of:
 *  - A dynamic movie banner displaying the active movie.
 *  - A movie carousel allowing users to select other movies.
 *
 * Dependencies:
 *  - React hooks (useState, useEffect)
 *  - Materialize CSS for basic UI styles
 *  - Custom components: MovieBanner, MovieCarousel
 *  - Local movie data (moviesData)
 */

import "./carrouselScreen.css";
import "materialize-css/dist/css/materialize.min.css";
import { useState, useEffect } from "react";
import { moviesData } from "./movieData";
import MovieBanner from "../../components/MovieBanner/MovieBanner";
import MovieCarousel from "../../components/MovieCarrousel/MovieCarrousel";
import type { Movie } from "../../types/movie";

export default function CarrouselScreen() {
  /**
   * Movies list loaded from local data.
   * This array should contain at least 5 predefined movies.
   */
  const movies = moviesData as Movie[];

  /** Default movie displayed when the screen is first loaded. */
  const defaultMovie = movies[0] as Movie;

  /**
   * State: Stores the background image for the main banner.
   * Initialized with the default movie background.
   */
  const [backgroundImage, setBackgroundImage] = useState<string>(
    `/movie/movie-website-landing-page-images/movies/${defaultMovie.backgroundImage}`
  );

  /**
   * State: Keeps track of the currently active (selected) movie.
   */
  const [activeMovieId, setActiveMovieId] = useState<Movie["id"]>(defaultMovie.id);

  /**
   * Handles user selection of a movie from the carousel.
   * Updates the banner background and the active movie ID.
   *
   * @param bgImage - Background image filename or full URL.
   * @param movieId - ID of the selected movie.
   */
  const handleMovieSelect = (bgImage: string, movieId: Movie["id"]) => {
    const bg =
      bgImage.startsWith("http") || bgImage.startsWith("/")
        ? bgImage
        : `/movie/movie-website-landing-page-images/movies/${bgImage}`;
    setBackgroundImage(bg);
    setActiveMovieId(movieId);
  };

  /**
   * Handles click event for "See Reviews" button.
   * (Currently logs to console — to be replaced by navigation or modal logic.)
   *
   * @param movieId - ID of the movie to view reviews for.
   */
  const handleReviewClick = (movieId: Movie["id"]) => {
    console.log(`Go to reviews for ${movieId}`);
  };

  /**
   * Handles click event for "Add to List" button.
   * (Currently logs to console — to be integrated with user list logic.)
   *
   * @param movieId - ID of the movie added to the list.
   */
  const handleAddToList = (movieId: Movie["id"]) => {
    console.log(`Added ${movieId} to list`);
  };

  /**
   * useEffect:
   * Ensures that when the component mounts, the banner background
   * resets to the default movie background image.
   */
  useEffect(() => {
    setBackgroundImage(
      `/movie/movie-website-landing-page-images/movies/${defaultMovie.backgroundImage}`
    );
  }, [defaultMovie.backgroundImage]);

  /**
   * Renders the carousel screen layout:
   *  - The banner (MovieBanner) component displays the active movie info.
   *  - The carousel (MovieCarousel) allows switching between movies.
   */
  return (
    <div className="carrousel-screen" data-testid="carrousel-screen">
      <div className="carrousel-container">
        <header />
        <MovieBanner
          data-testid="movie-banner"
          backgroundImage={backgroundImage}
          movies={movies}
          activeMovieId={activeMovieId}
          onReviewClick={handleReviewClick}
          onAddToList={handleAddToList}
        >
          <MovieCarousel
            data-testid="movie-carousel"
            movies={movies}
            onMovieSelect={handleMovieSelect}
          />
        </MovieBanner>
      </div>
    </div>
  );
}
