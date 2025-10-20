import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./API/authContext";
import "./index.css";
import Login from "./screens/loginScreen/login";
import Register from "./screens/registerScreen/register";
import Recovery from "./screens/recoveryScreen/recovery";
import Principal from "./screens/mainScreen/principal";
import MovieDetail from "./screens/movieDetail/movieDetail";
import CarrouselScreen from "./screens/carrouselScreen/carrouselScreen";
import CategoriesScreen from "./screens/categoriesScreen/categoriesScreen";
import MyReviewsScreen from "./screens/myReviewsScreen/myReviewsScreen";
import PremieresScreen from "./screens/premieresScreen/PremieresScreen";
import Profile from "./screens/profileScreen/profileScreen";
import PlayerScreen from "./screens/PlayerScreen/player";
import Help from "./screens/helpScreen/help";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <AuthProvider>
    
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<Principal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/carrousel_principal" element={<CarrouselScreen />} />
          <Route path="/categories" element={<CategoriesScreen />} />
          <Route path="/my-reviews" element={<MyReviewsScreen />} />
          <Route path="/premieres" element={<PremieresScreen />} />
          <Route path="/movie/:id" element={<MovieDetail />} /> 
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/help" element={<Help />} />
          <Route path="/player/:id" element={<PlayerScreen />} />
        </Routes>

        {/* Footer global */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/logo.png" alt="FilmHub Logo" className="footer-logo" />
              <p>FilmHub — Discover, rate and enjoy the best movies online.</p>
            </div>
            <div className="footer-links">
              {/* Si estas rutas no existen aún, déjalas como # o crea páginas vacías */}
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/help">Help</a>
              <a href="/terms">Terms of Use</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
          <p className="footer-copy">© 2025 FilmHub — All rights reserved.</p>
        </footer>
      </div>
    </AuthProvider>
  </BrowserRouter>
);
