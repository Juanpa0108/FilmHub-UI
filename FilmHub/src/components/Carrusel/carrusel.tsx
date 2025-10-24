import React, { useState } from "react";
import "./carrusel.css";

/**
 * `Carrusel` Component
 *
 * Displays a simple horizontal movie carousel with navigation arrows.
 * The carousel shows a limited number of movies per slide and allows
 * cycling through them with "previous" and "next" buttons.
 *
 * This is a static demo carousel, but can easily be adapted
 * to display dynamic movie data from an API or context.
 *
 * @component
 * @example
 * ```tsx
 * <Carrusel />
 * ```
 */
const Carrusel: React.FC = () => {
  // Index of the currently visible slide
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * Demo movie data.
   * Replace this array with your dynamic movie list.
   */
  const movies = [
    { title: "A VOTER OF THE LIVING BEST", subtitle: "A WOMAN OF THE MUSIC", percent: "STARTER" },
    { title: "A Working Man", percent: "55%" },
    { title: "Death of a Unicorn", percent: "57%" },
    { title: "The Woman in the Yard", percent: "33%" },
    { title: "Disney's Snow White", percent: "42%" },
    { title: "Disney's Snow White", percent: "74%" },
    { title: "The Chosen: Last Supper - Part 1", percent: "100%" },
    { title: "Mickey 17", percent: "78%" },
  ];

  // Number of movie cards displayed per slide
  const itemsPerPage = 4;

  // Total number of slides (based on the number of movies)
  const totalSlides = Math.ceil(movies.length / itemsPerPage);

  /** Go to the next slide (loops back to the first at the end). */
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  /** Go to the previous slide (loops back to the last when at the beginning). */
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  /** Subset of movies currently visible on screen. */
  const visibleMovies = movies.slice(
    currentSlide * itemsPerPage,
    (currentSlide + 1) * itemsPerPage
  );

  return (
    <div className="movies-carousel">
      {/* Header Section */}
      <div className="carousel-header">
        <h2>Movies in Theaters</h2>
        <p>
          Brought to you by <strong>UNICORN</strong>
        </p>
      </div>

      {/* Carousel Main Area */}
      <div className="carousel-wrapper">
        {/* Left Navigation */}
        <button className="carousel-arrow left" onClick={prevSlide}>
          &lt;
        </button>

        {/* Movie Cards */}
        <div className="carousel-track">
          {visibleMovies.map((movie, index) => (
            <div key={index} className="movie-card">
              <div className="movie-percent">{movie.percent}</div>
              <div className="movie-title">{movie.title}</div>
              {movie.subtitle && (
                <div className="movie-subtitle">{movie.subtitle}</div>
              )}
            </div>
          ))}
        </div>

        {/* Right Navigation */}
        <button className="carousel-arrow right" onClick={nextSlide}>
          &gt;
        </button>
      </div>

      {/* Footer Action */}
      <div className="view-all">
        <button>VIEW ALL</button>
      </div>
    </div>
  );
};

export default Carrusel;
