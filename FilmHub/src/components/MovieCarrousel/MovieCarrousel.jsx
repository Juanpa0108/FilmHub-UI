// 4. MovieCarousel.jsx - Carousel component
import React, { useEffect } from "react";
import M from "materialize-css";
import CarrouselItem from "../CarrouselItem/CarrouselItem.jsx";
import "../../screens/carrouselScreen/carrouselScreen.css";

const MovieCarousel = ({ movies, onMovieSelect }) => {
  useEffect(() => {
    const elems = document.querySelectorAll(".carousel");
    M.Carousel.init(elems, {});
  }, []);

  return (
    <div className="carousel-box" role="carousel-box">
      <div className="carousel" role="carousel">
        {movies.map((movie) => (
          <CarrouselItem role="carousel-item"
            key={movie.id}
            movie={movie} 
            onMovieSelect={onMovieSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;