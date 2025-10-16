import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../API/auth";
import Searchbar from "../../components/SearchBar/Searchbar";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import "../../screens/carrouselScreen/carrouselScreen.css";
import "./myReviewsScreen.css";

const MyReviewsScreen: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user } = useAuth();

  const reviews = [
    {
      id: 1,
      movieTitle: "Minecraft: The Movie",
      image: "/images/minecraft.jpg",
      rating: 4,
      author: "Juan",
      comment:
        "Very fun and colorful! Perfect for kids and fans of the game. Jason Momoa was hilarious!",
    },
    {
      id: 2,
      movieTitle: "Oppenheimer",
      image: "/images/oppenheimer.jpg",
      rating: 5,
      author: "Juan",
      comment: "A masterpiece! Deep, thought-provoking, and powerful.",
    },
  ];

  return (
    <div className="app-container">
      <div className="navbar">
        <div className="brand">
          <Link to="/">
            <BrandLogo className="logo" />
          </Link>
          <span className="brand-text">
            Film <span className="brand-subtext">Hub</span>
          </span>
        </div>

        <div className="header">
          <Searchbar />
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

      <div className="reviews-section">
        <h2>My Movie Reviews</h2>
        <p>These are your latest movie ratings and comments.</p>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <img src={review.image} alt={review.movieTitle} />
              <div className="review-content">
                <h3>{review.movieTitle}</h3>
                <p className="rating">⭐ {review.rating}/5</p>
                <p className="comment">"{review.comment}"</p>
                <p className="author">- {review.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyReviewsScreen;
