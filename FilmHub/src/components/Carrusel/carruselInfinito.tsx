import { useEffect, useRef } from "react";
import "./carruselInfinito.css";

// Tipamos las props: un array de strings con URLs
type CarruselInfinitoProps = {
  images?: string[]; // If not provided, we'll use defaults from /font-awesome/images
};

export default function CarruselInfinito({ images = [] }: CarruselInfinitoProps) {
  // Tipamos el ref como un DIV del DOM (o cambia a HTMLElement si no es <div>)
  const carruselRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);

  // Helper: build absolute URL respecting Vite base
  const withBase = (p: string) => {
    const base = (import.meta as any).env?.BASE_URL ?? "/";
    // keep full urls or absolute starting with '/'
    if (/^(https?:)?\/\//i.test(p) || p.startsWith("/")) return p;
    return `${base.replace(/\/$/, "")}/${p.replace(/^\//, "")}`;
  };

  useEffect(() => {
    const el = carruselRef.current;
    if (!el) return;
    // Desactiva la animación CSS para evitar conflictos
    el.style.animation = "none";
    el.style.willChange = "transform";

    const speedPxPerSec = 60; // velocidad suave (px/seg)
    let halfWidth = 0;

    const measure = () => {
      // Metade del ancho del contenido duplicado
      halfWidth = el.scrollWidth / 2;
    };
    measure();

    const onResize = () => {
      measure();
    };
    window.addEventListener("resize", onResize);

    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000; // seg
      lastTsRef.current = ts;

      // Desplazar a la izquierda
      offsetRef.current -= speedPxPerSec * dt;
      // Cuando recorremos la primera mitad, reiniciamos
      if (-offsetRef.current >= halfWidth) {
        offsetRef.current = 0;
      }
      el.style.transform = `translateX(${offsetRef.current}px)`;

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      lastTsRef.current = null;
      offsetRef.current = 0;
      if (el) el.style.transform = "translateX(0)";
    };
  }, []);

  // Use defaults from public if consumer didn't pass any images
  const defaultImgs = [
    "font-awesome/images/img1.jpg",
    "font-awesome/images/img2.jpg",
    "font-awesome/images/img3.jpg",
    "font-awesome/images/img4.jpg",
  ].map(withBase);

  const imgs = (images.length ? images : defaultImgs).map(withBase);

  return (
    <div data-testid="carrusel-container" className="carrusel-container">
      {/* Asegúrate que este sea un <div> para que coincida con HTMLDivElement */}
      <div data-testid="carrusel" className="carrusel" ref={carruselRef}>
        {[...imgs, ...imgs].map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Carrusel item ${(index % imgs.length) + 1}`}
            data-testid={`carrusel-item-${index + 1}`}
            className="carrusel-img"
            onError={(e) => {
              // Fallback para evitar alt text feo si la ruta falla
              const target = e.currentTarget as HTMLImageElement;
              if (!target.dataset.fallback) {
                console.warn("CarruselInfinito: imagen no encontrada, usando fallback:", img);
                target.src = withBase("logo.png");
                target.dataset.fallback = "1";
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
