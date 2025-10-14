// 3. CarouselItem.jsx -Component for each item in the carousel
import React from "react";
import "../../screens/carrouselScreen/carrouselScreen.css";

// Shows the visual information of each movie in the carousels
// movie: the movie object
// onMovieSelect: function callback to handle the movie selection

const CarrouselItem = ({ movie, onMovieSelect }) => {
  return (
    <div 
      className="carousel-item"
      data-testid={`carousel-item-${movie.id}`} 
      onClick={() => onMovieSelect(movie.backgroundImage, movie.id)}
    >
      <img src={movie.thumbnailImage} alt={movie.alt} />
    </div>
  );
};

export default CarrouselItem;