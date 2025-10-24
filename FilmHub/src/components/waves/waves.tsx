import React from "react";
import "./waves.css";

/**
 * WavesBackground Component
 *
 * This component renders a layered, animated wave effect using pure CSS.
 * 
 * Each "wave" is a div styled with background gradients and keyframe animations
 * in `waves.css`. The duplication of each `.wave` layer (e.g. two `.wave1`s)
 * helps create smoother, overlapping motion and a parallax illusion.
 *
 * You can customize:
 *  - The number of wave layers (e.g., add `.wave4`)
 *  - Colors, opacity, or animation speed in the CSS
 *  - The container’s position to use it as a full-screen or section background
 *
 * Example usage:
 * ```tsx
 * <div className="page">
 *   <WavesBackground />
 *   <main> ... your content ... </main>
 * </div>
 * ```
 */
const WavesBackground: React.FC = () => {
  return (
    <div className="waves-container">
      {/* Repeated layers for smooth looping animation */}
      <div className="wave wave1"></div>
      <div className="wave wave1"></div>

      <div className="wave wave2"></div>
      <div className="wave wave2"></div>

      <div className="wave wave3"></div>
      <div className="wave wave3"></div>
    </div>
  );
};

export default WavesBackground;
