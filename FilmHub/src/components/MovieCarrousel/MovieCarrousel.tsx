import { useEffect } from "react";
import M from "materialize-css";
import CarrouselItem from "../CarrouselItem/CarrouselItem";
import "../../screens/carrouselScreen/carrouselScreen.css";

// Tipo mínimo de Movie que este componente necesita (ajústalo a tu modelo real)
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

export default function MovieCarousel({ movies, onMovieSelect }: MovieCarouselProps) {
  useEffect(() => {
    const elems = document.querySelectorAll(".carousel");
    // Inicializa y guarda las instancias para limpiar en unmount
    const instances: any = M.Carousel.init(elems, {});
    return () => {
      try {
        if (instances && typeof instances.forEach === "function") {
          instances.forEach((inst: any) => inst?.destroy?.());
        } else {
          elems.forEach((el) => {
            const inst = (M.Carousel as any).getInstance?.(el);
            inst?.destroy?.();
          });
        }
      } catch {}
    };
  }, []);

  return (
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
