/**
 * ResultsScreen.tsx
 * -----------------------------------------------------
 * Displays a list of movies based on a user search or shows all movies if no search term is provided.
 * 
 * Features:
 *  - Dynamically displays search results or a default list of movies.
 *  - Integrates the `MovieResult` component to render each movie.
 *  - Uses the `Movie` type for type safety.
 * 
 * Props:
 *  @prop {Movie[]} [searchResults]  - Optional array of movies matching the search.
 *  @prop {string}  [searchTerm]     - Optional search keyword used for display.
 * 
 * Example:
 *  <ResultsScreen searchResults={filteredMovies} searchTerm="Inception" />
 * 
 * Author: Kevin Javier Manzano García
 * Last Updated: October 2025
 */

import React from "react";
import MovieResult from "../../components/movieResult/movieResult";
import { moviesData } from "../carrouselScreen/movieData";
import { Movie } from "../../types/movie";
import "./resultsScreen.css";

// ------------------ Props Type ------------------ //
type ResultsProps = {
  searchResults?: Movie[]; // Optional movie list (from search)
  searchTerm?: string;     // Optional search keyword
};

// ------------------ Component ------------------ //
const ResultsScreen: React.FC<ResultsProps> = ({
  searchResults,
  searchTerm,
}) => {
  // If no search results exist, show the default movie dataset
  const moviesToShow: Movie[] = searchResults?.length
    ? searchResults
    : moviesData;

  // Use the provided search term or fallback to an empty string
  const term = searchTerm ?? "";

  return (
    <div className="results-container">
      {/* Header showing the search term or a generic title */}
      <div className="results-header" role="header">
        <h1>{term ? `Results of "${term}"` : "All movies"}</h1>
      </div>

      {/* Movie list */}
      <ul className="movies-result-list" role="list">
        {moviesToShow.map((movie) => (
          <MovieResult key={movie.id} movie={movie} />
        ))}
      </ul>
    </div>
  );
};

export default ResultsScreen;
