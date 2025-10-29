// src/screens/login/Login.tsx

/**
 * Login Screen Component
 * ----------------------
 * Displays the user authentication screen where users can log in with their credentials
 * or use social login options (Google, GitHub, Twitter).
 *
 * Features:
 *  - Email/password authentication using `useAuth` custom hook
 *  - Automatic session verification with backend (`/api/auth/verify`)
 *  - Graceful UI feedback when the server is waking up or responding slowly
 *  - Links to register and recover password
 *  - Responsive design with decorative wave background
 *
 * Behavior:
 *  - On mount, verifies if a valid session already exists and redirects to home if so
 *  - Displays loading feedback during authentication
 *  - Uses SweetAlert2 for quick error notifications
 *
 * Dependencies:
 *  - React, React Router
 *  - SweetAlert2 for alerts
 *  - useAuth custom hook for authentication
 *  - BrandLogo, WavesBackground, PasswordInput components
 *  - react-icons for social login icons
 */

import React, { useState, useEffect } from "react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import "./login.css";
import Swal from "sweetalert2";
import useAuth from "../../API/auth";
import { Link, useNavigate } from "react-router-dom";
import WavesBackground from "../../components/waves/waves";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { apiPath } from "../../config/env";
import BrandLogo from "../../components/BrandLogo/BrandLogo";

/**
 * Interface representing the structure of the login form data.
 */
type FormData = {
  email: string;
  password: string;
};

/**
 * Login Component
 * ---------------
 * Handles user authentication flow, including:
 *  - Login form state management
 *  - Input validation
 *  - API verification for existing sessions
 *  - Loading and slow-response UI handling
 */
const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  /**
   * On mount:
   *  - Checks if a valid session exists (by inspecting localStorage + backend verification).
   *  - Performs a "warm-up" ping to keep the backend responsive for first-time logins.
   */
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const stored = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");
      const user = stored ? (JSON.parse(stored) as { expirationDate?: number }) : null;

      const looksValid = !!token && !!user?.expirationDate && user.expirationDate > Date.now();
      if (!looksValid) return;

      try {
        const res = await fetch(apiPath("/api/auth/verify"), {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!cancelled && res.ok) {
          navigate("/", { replace: true });
        }
      } catch (_) {
        // Ignore errors to avoid redirecting on failed verification
      }
    };

    check();

    // "Warm-up" backend call to reduce cold start delay
    const controller = new AbortController();
    fetch(apiPath("/health"), { signal: controller.signal, cache: "no-store" }).catch(() => {});
    const timeout = setTimeout(() => controller.abort(), 2500);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [navigate]);

  /**
   * Handles form input changes.
   * @param e - Input change event from email or password fields.
   */
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
  };

  /**
   * Handles form submission.
   * Validates fields and triggers the login request using the `useAuth` hook.
   * Displays a feedback message if the process takes longer than expected.
   */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please fill in all fields.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const slowTimer = setTimeout(() => setIsSlow(true), 2000);
      login(formData);
      clearTimeout(slowTimer);
    } finally {
      setIsSubmitting(false);
      setIsSlow(false);
    }
  };

  /**
   * Renders the login form and related UI elements.
   */
  return (
    <div className="login-wrapper">
      <WavesBackground />

      <div className="login-grid">
        {/* Brand section */}
        <section className="login-brand">
          <Link to="/" aria-label="Go to home" className="brand-link">
            <BrandLogo className="brand-logo-xl" />
          </Link>
          <h2 className="brand-title">Become a Cinephile</h2>
        </section>

        {/* Login form section */}
        <div className="login-container" role="main">
          <h2>Welcome!</h2>

          {/* Register link */}
          <div id="id-register-link">
            <p>
              Don't you have an account?
              <Link to="/register"> Register</Link>
            </p>
          </div>

          {/* Login form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              inputMode="email"
            />
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              autoComplete="current-password"
            />
            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  {isSlow ? " Waking server…" : " Signing in…"}
                </>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Slow server notice */}
            {isSubmitting && isSlow && (
              <p className="slow-note" role="status">
                Waking the server for the first time can take a few seconds. Thanks for your patience.
              </p>
            )}
          </form>

          {/* Password recovery link */}
          <div id="recovery-link">
            <p>
              <Link to="/recovery"> Recover password?</Link>
            </p>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default Login;
