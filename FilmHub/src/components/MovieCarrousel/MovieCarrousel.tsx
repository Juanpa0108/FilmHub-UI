/**
 * MovieCarousel Component
 * -----------------------
 * Displays a horizontal carousel of movie thumbnails using Materialize CSS.
 * Supports both desktop (double-click) and mobile (double-tap) interactions
 * to navigate directly to the movie’s player page.
 *
 * Dependencies:
 * - Materialize CSS Carousel (M.Carousel)
 * - CarrouselItem (child component for each movie)
 * - React Router for navigation
 *
 * Props:
 * @prop {Movie[]} movies - Array of movie objects to display.
 * @prop {(backgroundImage: string, id: string | number) => void} onMovieSelect - Callback executed when a movie is selected (single tap or click).
 */

import { useEffect } from "react";
import M from "materialize-css";
import CarrouselItem from "../CarrouselItem/CarrouselItem";
import "../../screens/carrouselScreen/carrouselScreen.css";
import { useNavigate } from "react-router-dom";

/**
 * Minimal Movie type (adapt this to your main model if needed)
 */
type Movie = {
  id: string | number;
  backgroundImage: string;
  thumbnailImage: string;
  alt?: string;
};

type MovieCarouselProps = {
  movies: Movie[];
  onMovieSelect: (backgroundImage: string, id: string | number) => void;
};

/**
 * Functional component that renders a responsive, looping movie carousel.
 * Users can double-click (desktop) or double-tap (mobile) to open the player.
 */
export default function MovieCarousel({ movies, onMovieSelect }: MovieCarouselProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Materialize carousel
    const elems = document.querySelectorAll(".carousel");
    const instances: any = M.Carousel.init(elems, {});

    const carouselContainer = document.querySelector(".carousel");
    if (!carouselContainer) return;

    // Store info about the last tap/click to detect double-taps
    let lastTap: { time: number; key: string | null } | null = null;

    /**
     * Helper: Extracts the movie key (ID) from the clicked/tapped element.
     * Looks for the closest `.carousel-item`, checks `alt`, `src`, or `data-id`.
     */
    const getMovieKeyFromEvent = (ev: Event) => {
      const target = (ev.target as HTMLElement) || null;
      const item = target?.closest?.(".carousel-item") as HTMLElement | null;
      if (!item) return null;

      // Try to extract movie ID from <img alt="...">
      const img = item.querySelector("img") as HTMLImageElement | null;
      if (img) {
        if (img.alt && img.alt.trim()) return img.alt.trim();

        // If not available, try extracting digits from src (e.g. ".../65.jpg")
        const src = img.src || img.getAttribute("src") || "";
        const m = src.match(/\/([0-9]+)(?:\.[a-zA-Z]{2,4})?$/);
        if (m && m[1]) return m[1];
      }

      // Fallback: use data-id
      const dataId = item.getAttribute("data-id");
      if (dataId) return dataId;

      return null;
    };

    /**
     * Handle double-tap detection on touch devices.
     * Navigates to the player page if the same movie is tapped twice quickly.
     */
    const handleTouchEnd = (ev: TouchEvent) => {
      const key = getMovieKeyFromEvent(ev);
      if (!key) return;
      const now = Date.now();

      if (lastTap && lastTap.key === key && now - lastTap.time < 300) {
        // Double tap detected
        navigate(`/player/${key}`);
        lastTap = null;
      } else {
        lastTap = { time: now, key };
      }
    };

    /**
     * Handle double-click events for desktop users.
     * Opens the player page for the selected movie.
     */
    const handleDblClick = (ev: MouseEvent) => {
      const key = getMovieKeyFromEvent(ev);
      if (!key) return;
      navigate(`/player/${key}`);
    };

    // Event listeners for touch and click interactions
    carouselContainer.addEventListener("touchend", handleTouchEnd);
    carouselContainer.addEventListener("dblclick", handleDblClick);

    // Cleanup on component unmount
    return () => {
      try {
        carouselContainer.removeEventListener("touchend", handleTouchEnd);
        carouselContainer.removeEventListener("dblclick", handleDblClick);

        // Properly destroy all carousel instances
        if (instances && typeof instances.forEach === "function") {
          instances.forEach((inst: any) => inst?.destroy?.());
        } else {
          elems.forEach((el) => {
            const inst = (M.Carousel as any).getInstance?.(el);
            inst?.destroy?.();
          });
        }
      } catch {
        // Safe cleanup
      }
    };
  }, [movies, navigate]);

  return (
    /**
     * Main carousel container with ARIA support.
     */
    <div className="carousel-box" role="region" aria-label="movie carousel">
      <div className="carousel">
        {movies.map((movie) => (
          <CarrouselItem
            key={movie.id}
            movie={movie}
            onMovieSelect={onMovieSelect}
          />
        ))}
      </div>
    </div>
  );
}
