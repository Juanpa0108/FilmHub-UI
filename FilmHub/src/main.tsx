import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./API/authContext";
import { FavoritesProvider } from "./API/favoritesContext";
import "./index.css";
import Login from "./screens/loginScreen/login";
import Register from "./screens/registerScreen/register";
import Recovery from "./screens/recoveryScreen/recovery";
import Principal from "./screens/mainScreen/principal";
import Favorites from "./screens/favoritesScreen/Favorites";
import MovieDetail from "./screens/movieDetail/movieDetail";
import CarrouselScreen from "./screens/carrouselScreen/carrouselScreen";
import CategoriesScreen from "./screens/categoriesScreen/categoriesScreen";
import MyReviewsScreen from "./screens/myReviewsScreen/myReviewsScreen";
import Profile from "./screens/profileScreen/profileScreen";
import PlayerScreen from "./screens/PlayerScreen/player";
import Help from "./screens/helpScreen/help";
import About from "./screens/static/About";
import Contact from "./screens/static/Contact";
import Terms from "./screens/static/Terms";
import Privacy from "./screens/static/Privacy";

// Footer component extracted to access auth context cleanly
function AppFooter() {
  const { isAuthenticated } = useAuthContext();
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand footer-col">
          <img src="/logo.png" alt="FilmHub Logo" className="footer-logo" />
          <p>FilmHub — Discover, rate and enjoy the best movies online.</p>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/help">Help</Link>
          </div>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <div className="footer-links">
            <Link to="/terms">Terms of Use</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <div className="footer-links">
            <Link to="/categories">Categories</Link>
            {isAuthenticated && <Link to="/my-reviews">My Reviews</Link>}
            {isAuthenticated && <Link to="/favorites">Favorites</Link>}
          </div>
        </div>
      </div>
      <p className="footer-copy">© 2025 FilmHub — All rights reserved.</p>
    </footer>
  );
}



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <AuthProvider>
      <FavoritesProvider>
    
      <div className="app-wrapper">
        
        <Routes>
          <Route path="/" element={<Principal />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/carrousel_principal" element={<CarrouselScreen />} />
          <Route path="/categories" element={<CategoriesScreen />} />
          <Route path="/my-reviews" element={<MyReviewsScreen />} />
          <Route path="/player/:id" element={<PlayerScreen />} />
          <Route path="/movie/:id" element={<MovieDetail />} /> 
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>

        {/* Footer global */}
        <AppFooter />
      </div>
      </FavoritesProvider>
    </AuthProvider>
  </BrowserRouter>
);
