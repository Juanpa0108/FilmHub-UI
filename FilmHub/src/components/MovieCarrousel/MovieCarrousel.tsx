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
    // Tipamos 'elems' como NodeListOf<Element> para M.Carousel
    // Si los tipos no cuadran, M es 'any' con el .d.ts sugerido arriba
    M.Carousel.init(elems, {});
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
