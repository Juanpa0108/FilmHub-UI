import React, { useEffect, useRef } from "react";
import "./carruselInfinito.css";

const CarruselInfinito = ({ images = [] }) => {
    const carruselRef = useRef(null);

    useEffect(() => {
        const carrusel = carruselRef.current;
        if (carrusel) {
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
};

export default CarruselInfinito;
