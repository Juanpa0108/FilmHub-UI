import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import TopBar from "../../components/TopBar/TopBar";
import { moviesData } from "../../screens/carrouselScreen/movieData";
import { useAuthContext } from "../../API/authContext"; // 🔐 Import auth context
import "./PlayerScreen.css";

/**
 * PlayerScreen Component
 * ----------------------
 * - Displays a movie player for the selected movie (based on URL ID).
 * - Redirects to login if the user is not authenticated.
 */
const PlayerScreen: React.FC = () => {
  // Get movie ID from the URL (e.g., /player/the-little-mermaid)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Access authentication state from global AuthContext
  const { state } = useAuthContext() as any;
  const isAuthenticated = !!state?.user; // Boolean check for logged-in user

  // Find the movie by its ID
  const movie = moviesData.find((m) => m.id === id);

  /**
   * useEffect:
   * - If user is not authenticated → redirect to /login
   * - If movie not found → redirect to home (/)
   */
  useEffect(() => {
  if (!isAuthenticated) {
    navigate("/login", { replace: true }); // 🔄 Replaces current history entry
  } else if (!movie) {
    navigate("/", { replace: true }); // Avoids back loop too
  }
}, [isAuthenticated, movie, navigate]);

  // Prevent rendering while redirecting (avoids flickering)
  if (!isAuthenticated || !movie) return null;

  return (
    <div className="player-container">
      {/*Top navigation bar */}
      <TopBar />

      {/*Movie player section */}
      <div className="player-wrapper full-cover">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Embedded YouTube video */}
        <ReactPlayer
          className="react-player"
          url={movie.videoUrl}
          controls
          playing
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default PlayerScreen;
