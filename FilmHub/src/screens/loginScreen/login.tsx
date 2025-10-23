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

type FormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  // Si parece haber sesión, verificar con el backend antes de redirigir
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
        // Ignorar; no redirigir si falla
      }
    };
    check();
    // Dispara un ping de calentamiento al cargar la pantalla de login
    const controller = new AbortController();
    fetch(apiPath("/health"), { signal: controller.signal, cache: "no-store" }).catch(() => {});
    const timeout = setTimeout(() => controller.abort(), 2500);
    return () => { cancelled = true; clearTimeout(timeout); controller.abort(); };
  }, [navigate]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    // name es "email" | "password" en tu formulario
    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
  };

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
      // Si el servidor está frío, muestra un mensaje sutil después de 2s
      const slowTimer = setTimeout(() => setIsSlow(true), 2000);
      login(formData); // si login espera otro shape, tipéalo en useAuth
      clearTimeout(slowTimer);
    } finally {
      setIsSubmitting(false);
      setIsSlow(false);
    }
  };

  return (
    <div className="login-wrapper">
      <WavesBackground />
      <div className="login-grid">
        <section className="login-brand">
          <Link to="/" aria-label="Go to home" className="brand-link">
            <BrandLogo className="brand-logo-xl" />
          </Link>
          <h2 className="brand-title">Become a Cinephile</h2>
        </section>
        <div className="login-container" role="main">
        <h2>Welcome!</h2>

        <div id="id-register-link">
          <p>
            Don't you have an account?
            <Link to="/register"> Register</Link>
          </p>
        </div>

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
          {isSubmitting && isSlow && (
            <p className="slow-note" role="status">
              Waking the server for the first time can take a few seconds. Thanks for your patience.
            </p>
          )}
        </form>

        <div id="recovery-link">
          <p><Link to="/recovery"> Recover password?</Link></p>
        </div>

        <div className="social-login">
          <p>Or sign in with</p>
          <div className="social-icons" role="group" aria-label="Social sign-in">
            <button className="icon-btn google" type="button" aria-label="Sign in with Google"><FaGoogle /></button>
            <button className="icon-btn github" type="button" aria-label="Sign in with GitHub"><FaGithub /></button>
            <button className="icon-btn twitter" type="button" aria-label="Sign in with Twitter/X"><FaTwitter /></button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
