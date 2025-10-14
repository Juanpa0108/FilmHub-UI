import React from "react";
import MovieResult from "../../components/movieResult/movieResult";
import { moviesData } from "../carrouselScreen/movieData";
import "./resultsScreen.css";

const ResultsScreen = ({ searchResults, searchTerm }) => {
    // Si hay resultados de búsqueda, usarlos; si no, usar todos los datos
    const moviesToShow = searchResults || moviesData;
    
    return (
        <div className="results-container">
            <div className="results-header" role="header">
                <h1>
                    {searchTerm 
                        ? `Results of "${searchTerm}"` 
                        : "All movies"
                    }
                </h1>
            </div>
            <ul className="movies-result-list" role="list">
                {moviesToShow.map((movie) => (
                    <MovieResult key={movie.id} movie={movie} />
                ))}
            </ul>
        </div>
    );
};

export default ResultsScreen;
