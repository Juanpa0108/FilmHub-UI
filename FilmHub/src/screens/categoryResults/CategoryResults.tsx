import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { moviesData } from "../carrouselScreen/movieData";
import type { Movie } from "../../types/movie";
import TopBar from "../../components/TopBar/TopBar";
import ResultsScreen from "../resultsScreen/resultsScreen";

const unslug = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const CategoryResults: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const navigate = useNavigate();
  const readable = genre ? unslug(decodeURIComponent(genre)) : "";

  const list: Movie[] = moviesData.filter(
    (m) => (m.genre || "").toLowerCase() === readable.toLowerCase()
  );

  return (
    <div className="app-container">
      <TopBar />
      <button className="back-button page-back" onClick={() => navigate(-1)}>← Back</button>
      <ResultsScreen searchResults={list} searchTerm={`Category: ${readable}`} />
    </div>
  );
};

export default CategoryResults;
