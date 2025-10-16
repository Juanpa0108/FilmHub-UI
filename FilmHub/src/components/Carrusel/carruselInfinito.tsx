import { useEffect, useRef } from "react";
import "./carruselInfinito.css";

// Tipamos las props: un array de strings con URLs
type CarruselInfinitoProps = {
  images?: string[];
};

export default function CarruselInfinito({ images = [] }: CarruselInfinitoProps) {
  // Tipamos el ref como un DIV del DOM (o cambia a HTMLElement si no es <div>)
  const carruselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const carrusel = carruselRef.current;
    if (carrusel) {
      // Ahora TS sabe que 'style' existe
      carrusel.style.animation = "scroll 10s linear infinite";
    }
  }, []);

  if (images.length === 0) {
    return (
      <div data-testid="carrusel-container-empty" className="carrusel-container">
        <p>No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div data-testid="carrusel-container" className="carrusel-container">
      {/* Asegúrate que este sea un <div> para que coincida con HTMLDivElement */}
      <div data-testid="carrusel" className="carrusel" ref={carruselRef}>
        {[...images, ...images].map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Carrusel item ${(index % images.length) + 1}`}
            data-testid={`carrusel-item-${index + 1}`}
            className="carrusel-img"
          />
        ))}
      </div>
    </div>
  );
}
