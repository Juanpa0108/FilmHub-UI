import { useEffect, useRef } from "react";
import "./particles.css";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    // si falta algo, salimos
    if (!canvas || !ctx) return;

    const NUM_PARTICLES = 50;

    // --- helpers tipados con parámetros no–nulos ---
    const resize = (cv: HTMLCanvasElement) => {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
      cv: HTMLCanvasElement;

      constructor(cv: HTMLCanvasElement) {
        this.cv = cv;
        this.x = Math.random() * cv.width;
        this.y = Math.random() * cv.height;
        this.radius = Math.random() * 3 + 1;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > this.cv.width) this.dx *= -1;
        if (this.y < 0 || this.y > this.cv.height) this.dy *= -1;
      }

      draw(cx: CanvasRenderingContext2D) {
        cx.beginPath();
        cx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        cx.fillStyle = "rgba(255, 255, 255, 0.7)";
        cx.fill();
        cx.closePath();
      }
    }

    const particles: Particle[] = Array.from(
      { length: NUM_PARTICLES },
      () => new Particle(canvas)
    );

    resize(canvas);
    const onResize = () => resize(canvas);
    window.addEventListener("resize", onResize);

    let rafId = 0;
    const animate = (cv: HTMLCanvasElement, cx: CanvasRenderingContext2D) => {
      cx.fillStyle = "#78288C";
      cx.fillRect(0, 0, cv.width, cv.height);
      particles.forEach((p) => {
        p.update();
        p.draw(cx);
      });
      rafId = window.requestAnimationFrame(() => animate(cv, cx));
    };

    animate(canvas, ctx);

    // cleanup
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="animated-bg" />;
}
