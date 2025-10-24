/**
 * AnimatedBackground.tsx
 *
 * This component renders an animated particle background using the HTML5 Canvas API.
 * It creates a smooth motion of floating particles that bounce around the screen.
 * The animation is responsive and automatically resizes with the browser window.
 *
 * @module AnimatedBackground
 */

import { useEffect, useRef } from "react";
import "./particles.css";

/**
 * AnimatedBackground Component
 *
 * Uses a `<canvas>` element to render a dynamic animated particle field.
 * Each particle moves randomly and bounces off the edges of the screen.
 * The canvas automatically adjusts its size when the window is resized.
 *
 * @returns {JSX.Element} The animated background canvas element.
 */
export default function AnimatedBackground() {
  // Reference to the canvas DOM element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    // Exit early if the canvas or context is not available
    if (!canvas || !ctx) return;

    const NUM_PARTICLES = 50;

    /**
     * Adjusts the canvas size to match the browser window dimensions.
     * @param {HTMLCanvasElement} cv - The canvas element to resize.
     */
    const resize = (cv: HTMLCanvasElement) => {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    };

    /**
     * Represents a single particle in the animation.
     */
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

      /**
       * Updates the particle’s position and handles screen edge collisions.
       */
      update() {
        this.x += this.dx;
        this.y += this.dy;

        // Reverse direction when hitting screen edges
        if (this.x < 0 || this.x > this.cv.width) this.dx *= -1;
        if (this.y < 0 || this.y > this.cv.height) this.dy *= -1;
      }

      /**
       * Draws the particle on the given 2D rendering context.
       * @param {CanvasRenderingContext2D} cx - The canvas rendering context.
       */
      draw(cx: CanvasRenderingContext2D) {
        cx.beginPath();
        cx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        cx.fillStyle = "rgba(255, 255, 255, 0.7)";
        cx.fill();
        cx.closePath();
      }
    }

    // Initialize an array of random particles
    const particles: Particle[] = Array.from(
      { length: NUM_PARTICLES },
      () => new Particle(canvas)
    );

    // Set initial canvas size and listen for resize events
    resize(canvas);
    const onResize = () => resize(canvas);
    window.addEventListener("resize", onResize);

    let rafId = 0;

    /**
     * Animation loop that updates and redraws particles every frame.
     */
    const animate = (cv: HTMLCanvasElement, cx: CanvasRenderingContext2D) => {
      // Clear the background
      cx.fillStyle = "#0c0c0b";
      cx.fillRect(0, 0, cv.width, cv.height);

      // Update and draw all particles
      particles.forEach((p) => {
        p.update();
        p.draw(cx);
      });

      // Request the next animation frame
      rafId = window.requestAnimationFrame(() => animate(cv, cx));
    };

    animate(canvas, ctx);

    // Cleanup animation and event listener on component unmount
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="animated-bg" />;
}
