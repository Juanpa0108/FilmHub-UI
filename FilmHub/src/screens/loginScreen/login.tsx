import React, { useState, useEffect } from "react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import "./login.css";
import Swal from "sweetalert2";
import useAuth from "../../API/auth.js";
import { Link } from "react-router-dom";
import WavesBackground from "../../components/waves/waves";

type FormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { login, logout } = useAuth();
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });

  // Verificar si el usuario ya tiene sesión iniciada
  useEffect(() => {
    const stored = localStorage.getItem("user"); // string | null
    const user = stored ? JSON.parse(stored) as { expirationDate?: number } : null;

    if (user?.expirationDate && user.expirationDate > Date.now()) {
      Swal.fire({
        icon: "info",
        title: "You already have an active session",
        text: "If you want to log in with another account, you must log out first.",
        showCancelButton: true,
        confirmButtonText: "Log out",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        }
      });
    }
  }, [logout]); // incluye logout para contentar al linter

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

    await login(formData); // si login espera otro shape, tipéalo en useAuth
  };

  return (
    <div className="login-wrapper">
      <WavesBackground />
      <div className="login-container">
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
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign in</button>
        </form>

        <div id="recovery-link">
          <p><Link to="/recovery"> Recover password?</Link></p>
        </div>

        <div className="social-login">
          <p>Or sign in with</p>
          <div className="social-icons">
            <button className="icon-btn google" type="button"><FaGoogle /></button>
            <button className="icon-btn github" type="button"><FaGithub /></button>
            <button className="icon-btn twitter" type="button"><FaTwitter /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
