import React from "react";
import MovieResult from "../../components/movieResult/movieResult";
import { moviesData } from "../carrouselScreen/movieData";
import { Movie } from "../../types/movie";         // ← usa tu tipo
import "./resultsScreen.css";

type ResultsProps = {
  searchResults?: Movie[];     // ← opcionales
  searchTerm?: string;         // ← opcional
};

const ResultsScreen: React.FC<ResultsProps> = ({
  searchResults,
  searchTerm,
}) => {
  const moviesToShow: Movie[] = (searchResults?.length ? searchResults : moviesData);
  const term = searchTerm ?? "";

  return (
    <div className="results-container">
      <div className="results-header" role="header">
        <h1>{term ? `Results of "${term}"` : "All movies"}</h1>
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
