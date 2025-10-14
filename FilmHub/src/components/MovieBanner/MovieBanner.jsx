// 5. MovieBanner.jsx - Main banner component
import React from "react";
import MovieContent from "../MovieContent/MovieContent.jsx";
import "../../screens/carrouselScreen/carrouselScreen.css";

const MovieBanner = ({ 
  backgroundImage, 
  movies, 
  activeMovieId, 
  onReviewClick, 
  onAddToList 
}) => {
  return (
    <div 
      className="banner"
      role="banner"
      style={{
        background: `url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center"
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
};

export default MovieBanner;