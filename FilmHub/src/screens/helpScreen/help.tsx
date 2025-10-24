
/**
 * Help Screen Component
 * ---------------------
 * Displays a detailed help and FAQ section for users.
 *
 * Features:
 *  - Explains how to use the main functions of FilmHub (rating, profile, password, etc.)
 *  - Includes tips, notes, and troubleshooting instructions
 *  - Provides a support contact email for further assistance
 *
 * UI:
 *  - Top navigation bar with a back button
 *  - Responsive grid layout with cards for each help topic
 *
 * Behavior:
 *  - Uses `useNavigate` to return to the previous page
 *  - Sections are organized by topic IDs for anchor navigation
 *
 * Dependencies:
 *  - React
 *  - React Router (for navigation)
 *  - Local CSS module: `help.css`
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import "./help.css";

/**
 * The Help component provides an in-app help center.
 * It contains guides, tips, and troubleshooting steps for users
 * to better understand FilmHub’s features and settings.
 */
const Help: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="help-wrapper">
      <div className="help-container">
        {/* Top bar with navigation back button */}
        <div className="help-topbar">
          <button
            className="btn btn-back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ← Back
          </button>
        </div>

        {/* Main title and subtitle */}
        <h1 className="help-title">Help Center</h1>
        <p className="help-subtitle">
          Everything you need to get the most out of FilmHub
        </p>

        {/* Help content organized by topic */}
        <div className="help-grid">
          {/* Rating Section */}
          <section className="help-card" id="rating">
            <h2>How to rate a movie</h2>
            <ol>
              <li>Open the movie details page.</li>
              <li>Scroll to the rating/review section.</li>
              <li>
                Select your score (e.g., 1 to 5 stars) and optionally add a
                short review.
              </li>
              <li>
                Click “Submit”. You can edit or delete your rating later.
              </li>
            </ol>
            <p className="tip">
              Tip: Your ratings help improve recommendations for you.
            </p>
          </section>

          {/* Profile Section */}
          <section className="help-card" id="profile">
            <h2>How to update your profile</h2>
            <ol>
              <li>Go to Profile from the user menu (top-right).</li>
              <li>In the Account section, click “Change data”.</li>
              <li>
                Update your first name, last name, age, or email information.
              </li>
              <li>
                Click “Save changes” and confirm. Your information updates
                instantly.
              </li>
            </ol>
            <p className="note">
              Note: If you change your email, you may need to re-login for
              security reasons.
            </p>
          </section>

          {/* Password Section */}
          <section className="help-card" id="password">
            <h2>How to change your password</h2>
            <ol>
              <li>Go to Profile and scroll to the Security section.</li>
              <li>Enter your current password.</li>
              <li>
                Enter a new password (min 8 chars, one uppercase, one lowercase,
                one number) and confirm it.
              </li>
              <li>
                Click “Change password”. You’ll see a success message if the
                update was successful.
              </li>
            </ol>
          </section>

          {/* Reviews Section */}
          <section className="help-card" id="reviews">
            <h2>Reviews and comments</h2>
            <ul>
              <li>You can add a short review when rating a movie.</li>
              <li>Manage your reviews in “My Reviews”.</li>
              <li>
                Keep comments respectful — reviews that break our rules may be
                removed.
              </li>
            </ul>
          </section>

          {/* Discover Section */}
          <section className="help-card" id="discover">
            <h2>Discover movies</h2>
            <ul>
              <li>
                Use the Search bar at the top to find titles, genres, or
                keywords.
              </li>
              <li>
                Browse by Categories or check the Premieres section for the
                latest releases.
              </li>
              <li>
                Featured banners on the home page highlight trending or
                high-rated picks.
              </li>
            </ul>
          </section>

          {/* Account Section */}
          <section className="help-card" id="account">
            <h2>Account & security</h2>
            <ul>
              <li>
                We keep you signed in securely with short-lived authentication
                tokens.
              </li>
              <li>
                If your session is about to expire, you’ll receive a prompt to
                extend it.
              </li>
              <li>
                Forgot your password? Use “Recover account” on the login page.
              </li>
            </ul>
          </section>

          {/* Troubleshooting Section */}
          <section className="help-card" id="troubleshooting">
            <h2>Troubleshooting</h2>
            <ul>
              <li>
                Can’t update your profile? Make sure you’re logged in and try
                again.
              </li>
              <li>
                Got a 401 Unauthorized error? Log in again — your session may
                have expired.
              </li>
              <li>
                Images not displaying correctly? Clear your cache or perform a
                hard refresh (Ctrl/Cmd + Shift + R).
              </li>
            </ul>
          </section>

          {/* Support Section */}
          <section className="help-card" id="support">
            <h2>Contact & support</h2>
            <p>
              Need help? Reach us at{" "}
              <a href="mailto:support@filmhub.com">support@filmhub.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Help;
