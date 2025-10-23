import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../API/authContext";

// Componentes
import CarruselInfinito from "../../components/Carrusel/carruselInfinito";
import Carrusel from "../../components/Carrusel/carrusel";
import Searchbar from "../../components/SearchBar/Searchbar";
import CarrouselScreen from "../carrouselScreen/carrouselScreen";
import ResultsScreen from "../resultsScreen/resultsScreen";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import { FaUserCircle } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo/BrandLogo"; // ✅ nuevo logo

// Datos y estilos
import { moviesData } from "../carrouselScreen/movieData";
import "./principal.css";

const Principal: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authTick, setAuthTick] = useState(0); // fuerza re-render en cambios globales de auth
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Cerrar el menú de usuario con clic fuera o con tecla ESC
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!userMenuOpen) return;
      const target = e.target as Node | null;
      if (userMenuRef.current && target && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [userMenuOpen]);
  const { state } = useAuthContext();
  const user = state?.user;

  // Escucha actualizaciones globales de autenticación por si algún consumidor no re-renderiza a tiempo
  useEffect(() => {
    const handler = () => setAuthTick((v) => v + 1);
    window.addEventListener("auth:changed", handler as EventListener);
    return () => window.removeEventListener("auth:changed", handler as EventListener);
  }, []);

  const peliculasFiltradas = (moviesData || []).filter(
    (peli) =>
      peli.title.toLowerCase().includes(busqueda.toLowerCase()) ||
      peli.genre.toLowerCase().includes(busqueda.toLowerCase()) ||
      peli.year.includes(busqueda)
  );

  const titulos = moviesData.map((p) => p.title);

  const images = [
    "/font-awesome/images/img1.jpg",
    "/font-awesome/images/img2.jpg",
    "/font-awesome/images/img3.jpg",
    "/font-awesome/images/img4.jpg",
  ];

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="brand">
          <Link to="/" className="logo-link">
            <BrandLogo className="logo" /> {/* ✅ reemplaza <img> */}
          </Link>
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
                <Link to="/favorites">Favorites</Link>
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
              <div className="user-menu" ref={userMenuRef}>
                <button
                  className="user-avatar"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  title={user?.username || user?.email}
                >
                  <FaUserCircle />
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown" role="menu">
                    <div className="user-header">{user?.firstName || user?.username || user?.email}</div>
                    <Link className="user-item" to="/profile" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                      Profile
                    </Link>
                    <div className="user-item" role="menuitem">
                      <LogoutButton />
                    </div>
                  </div>
                )}
              </div>
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
