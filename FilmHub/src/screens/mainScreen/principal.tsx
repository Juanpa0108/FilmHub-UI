import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../API/auth";

// Componentes
import CarruselInfinito from "../../components/Carrusel/carruselInfinito";
import Carrusel from "../../components/Carrusel/carrusel";
import Searchbar from "../../components/SearchBar/Searchbar";
import CarrouselScreen from "../carrouselScreen/carrouselScreen";
import ResultsScreen from "../resultsScreen/resultsScreen";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import BrandLogo from "../../components/BrandLogo/BrandLogo"; // ✅ nuevo logo

// Datos y estilos
import { moviesData } from "../carrouselScreen/movieData";
import "./principal.css";

const Principal: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user } = useAuth();

  const peliculasFiltradas = (moviesData || []).filter(
    (peli) =>
      peli.title.toLowerCase().includes(busqueda.toLowerCase()) ||
      peli.genre.toLowerCase().includes(busqueda.toLowerCase()) ||
      peli.year.includes(busqueda)
  );

  const titulos = moviesData.map((p) => p.title);

  const images = [
    "/images/img1.jpg",
    "/images/img2.jpg",
    "/images/img3.jpg",
    "/images/img4.jpg",
  ];

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="brand">
          <Link to="/" className="logo-link">
            <BrandLogo className="logo" /> {/* ✅ reemplaza <img> */}
          </Link>
          <span className="brand-text">
            Film <span className="brand-subtext">Hub</span>
          </span>
        </div>

        <div className="header">
          <Searchbar onSearch={setBusqueda} suggestions={titulos} />

          <div className="menu-container">
            <button
              className="menu-button"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              ☰
            </button>
            {menuAbierto && (
              <div className="dropdown-menu">
                <Link to="/categories">Categories</Link>
                <Link to="/my-reviews">My Reviews</Link>
                <Link to="/premieres">Premieres</Link>
                <Link to="/coming-soon">Coming Soon</Link>
              </div>
            )}
          </div>

          <div className="auth-buttons">
            {!user ? (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            ) : (
              <LogoutButton />
            )}
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="movie-carousel-section">
        <CarrouselScreen />
      </div>

      <div className="carrusel-banner">
        <CarruselInfinito images={images} />
      </div>

      <div className="static-carousel-container">
        <Carrusel />
      </div>

      {/* RESULTADOS DE BÚSQUEDA */}
      {busqueda ? (
        <div className="search-results">
          {peliculasFiltradas.length > 0 ? (
            <div className="results-banner">
              <ResultsScreen
                searchResults={peliculasFiltradas}
                searchTerm={busqueda}
              />
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      ) : (
        <div className="results-banner">
          <ResultsScreen />
        </div>
      )}
    </div>
  );
};

export default Principal;
