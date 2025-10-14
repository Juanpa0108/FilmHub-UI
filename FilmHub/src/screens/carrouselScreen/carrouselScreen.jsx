// 6. CarrouselScreen.jsx - Componente principal refactorizado
import "./carrouselScreen.css";
import "materialize-css/dist/css/materialize.min.css";
import React, { useState, useEffect } from "react";
import { moviesData } from "./movieData";
import MovieBanner from "../../components/MovieBanner/MovieBanner";
import MovieCarousel from "../../components/MovieCarrousel/MovieCarrousel";

const CarrouselScreen = () => {
  const defaultMovie = moviesData[0];
  const [backgroundImage, setBackgroundImage] = useState(
    `/movie/movie-website-landing-page-images/movies/${defaultMovie.backgroundImage}`
  );
  const [activeMovieId, setActiveMovieId] = useState(defaultMovie.id);

  const handleMovieSelect = (bgImage, movieId) => {
    setBackgroundImage(`/movie/movie-website-landing-page-images/movies/${bgImage}`);
    setActiveMovieId(movieId);
  };

  const handleReviewClick = (movieId) => {
    console.log(`Go to reviews for ${movieId}`);
  };

  const handleAddToList = (movieId) => {
    console.log(`Added ${movieId} to list`);
  };

  useEffect(() => {
    setBackgroundImage(`/movie/movie-website-landing-page-images/movies/${defaultMovie.backgroundImage}`);
  }, []);

  return (
    <div className="carrousel-screen" role="carrousel-screen">
      <div className="carrousel-container">
        <header></header>
        
        <MovieBanner role="movie-banner"
          backgroundImage={backgroundImage}
          movies={moviesData}
          activeMovieId={activeMovieId}
          onReviewClick={handleReviewClick}
          onAddToList={handleAddToList}
        />
        
        <MovieCarousel role="movie-carousel"
          movies={moviesData}
          onMovieSelect={handleMovieSelect}
        />
      </div>
    </div>
  );
};

export default CarrouselScreen;