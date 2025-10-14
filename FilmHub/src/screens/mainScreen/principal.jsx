import React, { useState } from "react";
import logo from "../../assets/logo.png";
import CarruselInfinito from "../../components/Carrusel/carruselInfinito.jsx";
import Carrusel from "../../components/Carrusel/carrusel.jsx";
import useAuth from "../../API/auth";
import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton/logoutButton.jsx";
import Searchbar from "../../components/SearchBar/Searchbar.jsx";
import CarrouselScreen from "../carrouselScreen/carrouselScreen.jsx";
import ResultsScreen from "../resultsScreen/resultsScreen.jsx";
import { moviesData } from "../carrouselScreen/movieData";
import "./principal.css";

const Principal = () => {
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user } = useAuth();

  const peliculasFiltradas = (moviesData || []).filter((peli) =>
    peli.title.toLowerCase().includes(busqueda.toLowerCase()) ||
    peli.genre.toLowerCase().includes(busqueda.toLowerCase()) ||
    peli.year.includes(busqueda)
  );
  const titulos = moviesData.map(p => p.title);

  const images = [
    "/images/img1.jpg",
    "/images/img2.jpg",
    "/images/img3.jpg",
    "/images/img4.jpg"
  ];

  return (
    <div className="app-container">
      <div className="navbar">
        <div className="brand">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
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

      <div className="movie-carousel-section">
        <CarrouselScreen />
      </div>

      <div className="carrusel-banner">
        <CarruselInfinito images={images} />
      </div>

      <div className="static-carousel-container">
        <Carrusel />
      </div>

      {/* Resultados búsqueda */}
      {busqueda && (
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
      )}

      {/* Mostrar todas si no hay búsqueda */}
      {!busqueda && (
        <div className="results-banner">
          <ResultsScreen />
        </div>
      )}
    </div>
  );
};

export default Principal;
