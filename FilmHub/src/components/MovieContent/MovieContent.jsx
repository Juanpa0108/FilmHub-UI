// 2. MovieContent.jsx - Component for the content of each film
import React from "react";
import "../../screens/carrouselScreen/carrouselScreen.css";

// Shows the visual information of each movie in the carousels
// movie: the movie object
// isActive: boolean to check if the movie is active
// onReviewClick: function callback to handle the review click
// onAddToList: function callback to handle the add to list click
//shows the title image, title, description, and buttons
const MovieContent = ({ movie, isActive, onReviewClick, onAddToList }) => {
  return (
    <div 
      className={`content ${movie.id} ${isActive ? "active" : ""}`}
      data-testid={`movie-content-${movie.id}`}
    >
      <img 
        src={movie.titleImage} 
        alt={movie.title} 
        className="movie-title-image" 
        
      />
      <h4 className="movie-title">
        <span>{movie.year}</span>
        <span><i>{movie.rating}</i></span>
        <span>{movie.duration}</span>
        <span>{movie.genre}</span>
      </h4>
      <p className="movie-description">
        {movie.description}
      </p>
      <div className="button">
        <a onClick={() => onReviewClick(movie.id)} href="#">
          <i className="fa fa-play" aria-hidden="true"></i>Reviews
        </a>
        <a onClick={() => onAddToList(movie.id)} href="#">
          <i className="fa fa-plus" aria-hidden="true"></i>My List
        </a>
      </div>
    </div>
  );
};

export default MovieContent;
