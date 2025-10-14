import React, { useState } from "react";
import "./carrusel.css";

const Carrusel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Datos de las películas (puedes reemplazar con tus datos reales)
    const movies = [
        { title: "A VOTER OF THE LIVING BEST", subtitle: "A WOMAN OF THE MUSIC", percent: "STARTER" },
        { title: "A Working Man", percent: "55%" },
        { title: "Death of a Unicorn", percent: "57%" },
        { title: "The Woman in the Yard", percent: "33%" },
        { title: "Disney's Snow White", percent: "42%" },
        { title: "Disney's Snow White", percent: "74%" },
        { title: "The Chosen: Last Supper - Part 1", percent: "100%" },
        { title: "Mickey 17", percent: "78%" }
    ];

    const itemsPerPage = 4;
    const totalSlides = Math.ceil(movies.length / itemsPerPage);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const visibleMovies = movies.slice(
        currentSlide * itemsPerPage,
        (currentSlide + 1) * itemsPerPage
    );

    return (
        <div className="movies-carousel">
            <div className="carousel-header">
                <h2>Movies in Theaters</h2>
                <p>Brought to you by <strong>UNICORN</strong></p>
            </div>

            <div className="carousel-wrapper">
                <button className="carousel-arrow left" onClick={prevSlide}>&lt;</button>
                
                <div className="carousel-track">
                    {visibleMovies.map((movie, index) => (
                        <div key={index} className="movie-card">
                            <div className="movie-percent">{movie.percent}</div>
                            <div className="movie-title">{movie.title}</div>
                            {movie.subtitle && <div className="movie-subtitle">{movie.subtitle}</div>}
                        </div>
                    ))}
                </div>
                
                <button className="carousel-arrow right" onClick={nextSlide}>&gt;</button>
            </div>

            <div className="view-all">
                <button>VIEW ALL</button>
            </div>
        </div>
    );
};

export default Carrusel;