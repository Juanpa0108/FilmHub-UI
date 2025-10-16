import React from "react";
import "./waves.css"; // Importa los estilos

const WavesBackground = () => {
  return (
    <div className="waves-container">
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