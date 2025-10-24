import { useEffect, useRef } from "react";
import "./carruselInfinito.css";

/**
 * Props for the `CarruselInfinito` component.
 * @property {string[]} [images] - Optional array of image URLs.
 * If not provided, default placeholder images from `/font-awesome/images` are used.
 */
type CarruselInfinitoProps = {
  images?: string[];
};

/**
 * `CarruselInfinito` Component
 *
 * Displays an infinitely scrolling horizontal carousel.
 * The carousel duplicates its image set and continuously translates it
 * leftwards using a smooth animation powered by `requestAnimationFrame`.
 *
 * Designed for logos, banners, or partner strips that should scroll endlessly.
 *
 * @example
 * ```tsx
 * <CarruselInfinito images={["/logos/logo1.png", "/logos/logo2.png"]} />
 * ```
 */
export default function CarruselInfinito({ images = [] }: CarruselInfinitoProps) {
  /** Reference to the carousel container element (DOM node). */
  const carruselRef = useRef<HTMLDivElement | null>(null);

  /** Reference to the current animation frame (used for cleanup). */
  const rafRef = useRef<number | null>(null);

  /** Timestamp of the last animation frame. */
  const lastTsRef = useRef<number | null>(null);

  /** Current horizontal offset in pixels. */
  const offsetRef = useRef<number>(0);

  /**
   * Utility: returns a valid absolute URL respecting the Vite `BASE_URL`.
   * Keeps full or absolute URLs untouched.
   */
  const withBase = (p: string) => {
    const base = (import.meta as any).env?.BASE_URL ?? "/";
    if (/^(https?:)?\/\//i.test(p) || p.startsWith("/")) return p;
    return `${base.replace(/\/$/, "")}/${p.replace(/^\//, "")}`;
  };

  /**
   * Animation effect:
   * - Disables CSS animation to avoid conflicts.
   * - Continuously shifts the carousel content left.
   * - Resets to the start once half of the duplicated content has scrolled.
   */
  useEffect(() => {
    const el = carruselRef.current;
    if (!el) return;

    // Disable any CSS-based animations for smoother control
    el.style.animation = "none";
    el.style.willChange = "transform";

    const speedPxPerSec = 60; // Smooth scrolling speed (pixels per second)
    let halfWidth = 0;

    /** Measures half of the total scroll width (for looping reset). */
    const measure = () => {
      halfWidth = el.scrollWidth / 2;
    };
    measure();

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    /** Frame-by-frame animation handler. */
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000; // convert to seconds
      lastTsRef.current = ts;

      // Move the carousel left
      offsetRef.current -= speedPxPerSec * dt;

      // Reset to start when the first half finishes scrolling
      if (-offsetRef.current >= halfWidth) {
        offsetRef.current = 0;
      }

      el.style.transform = `translateX(${offsetRef.current}px)`;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    /** Cleanup: stop animation and reset styles. */
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      lastTsRef.current = null;
      offsetRef.current = 0;
      if (el) el.style.transform = "translateX(0)";
    };
  }, []);

  /** Default fallback images (from `/public/font-awesome/images`). */
  const defaultImgs = [
    "font-awesome/images/img1.jpg",
    "font-awesome/images/img2.jpg",
    "font-awesome/images/img3.jpg",
    "font-awesome/images/img4.jpg",
  ].map(withBase);

  /** Final image list (user-provided or defaults). */
  const imgs = (images.length ? images : defaultImgs).map(withBase);

  return (
    <div data-testid="carrusel-container" className="carrusel-container">
      {/* Main scrolling container */}
      <div data-testid="carrusel" className="carrusel" ref={carruselRef}>
        {[...imgs, ...imgs].map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Carousel item ${(index % imgs.length) + 1}`}
            data-testid={`carrusel-item-${index + 1}`}
            className="carrusel-img"
            onError={(e) => {
              // Fallback to logo if the image fails to load
              const target = e.currentTarget as HTMLImageElement;
              if (!target.dataset.fallback) {
                console.warn("CarruselInfinito: Image not found, using fallback:", img);
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
