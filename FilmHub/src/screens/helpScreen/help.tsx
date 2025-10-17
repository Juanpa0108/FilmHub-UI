import React from "react";
import { useNavigate } from "react-router-dom";
import "./help.css";

const Help: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="help-wrapper">
      <div className="help-container">
        <div className="help-topbar">
          <button
            className="btn btn-back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ← Back
          </button>
        </div>
        <h1 className="help-title">Help Center</h1>
        <p className="help-subtitle">Everything you need to get the most out of FilmHub</p>

        <div className="help-grid">
          <section className="help-card" id="rating">
            <h2>How to rate a movie</h2>
            <ol>
              <li>Open the movie details page.</li>
              <li>Scroll to the rating/review section.</li>
              <li>Select your score (e.g., 1 to 5 stars) and optionally add a short review.</li>
              <li>Click “Submit”. You can edit or delete your rating later.</li>
            </ol>
            <p className="tip">Tip: Your ratings help improve recommendations for you.</p>
          </section>

          <section className="help-card" id="profile">
            <h2>How to update your profile</h2>
            <ol>
              <li>Go to Profile from the user menu (top-right).</li>
              <li>In the Account section, click “Change data”.</li>
              <li>Update your first name, last name, age, or email.</li>
              <li>Click “Save changes” and confirm. Your info will update instantly.</li>
            </ol>
            <p className="note">Note: If you change your email, you may need to re-login for security.</p>
          </section>

          <section className="help-card" id="password">
            <h2>How to change your password</h2>
            <ol>
              <li>Go to Profile and scroll to the Security section.</li>
              <li>Enter your current password.</li>
              <li>Enter a new password (min 8 chars, one uppercase, one lowercase, one number) and confirm it.</li>
              <li>Click “Change password”. You’ll see a success message if it worked.</li>
            </ol>
          </section>

          <section className="help-card" id="reviews">
            <h2>Reviews and comments</h2>
            <ul>
              <li>You can add a short review when rating a movie.</li>
              <li>Manage your reviews in “My Reviews”.</li>
              <li>Keep things respectful—reviews that break our rules may be removed.</li>
            </ul>
          </section>

          <section className="help-card" id="discover">
            <h2>Discover movies</h2>
            <ul>
              <li>Use the Search bar at the top to find titles, genres, or keywords.</li>
              <li>Browse by Categories or check the Premieres section for the latest releases.</li>
              <li>Featured banners on the home page highlight trending or highly rated picks.</li>
            </ul>
          </section>

          <section className="help-card" id="account">
            <h2>Account & security</h2>
            <ul>
              <li>We keep you signed in securely with short-lived tokens.</li>
              <li>If your session is about to expire, you’ll get a prompt to extend it.</li>
              <li>If you forget your password, use “Recover account” on the login page.</li>
            </ul>
          </section>

          <section className="help-card" id="troubleshooting">
            <h2>Troubleshooting</h2>
            <ul>
              <li>Can’t update profile? Make sure you’re logged in and try again.</li>
              <li>401 Unauthorized? Log in again; your session may have expired.</li>
              <li>Images look off? Clear cache or try a hard refresh (Ctrl/Cmd + Shift + R).</li>
            </ul>
          </section>

          <section className="help-card" id="support">
            <h2>Contact & support</h2>
            <p>If you need help, contact us at <a href="mailto:support@filmhub.com">support@filmhub.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Help;
