import React, { useState, useEffect } from "react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import "./login.css"; 
import Swal from "sweetalert2";
import useAuth from "../../API/auth.js";
import { Link } from "react-router-dom";
import WavesBackground from "../../components/waves/waves";

const Login = () => {
  const { login ,logout} = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Verificar si el usuario ya tiene sesión iniciada
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.expirationDate > new Date().getTime()) {
    Swal.fire({
      icon: "info",
      title: "You already have an active session",
      text: "If you want to log in with another account, you must log out first.",
      showCancelButton: true,
      confirmButtonText: "Log out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Si elige "Cerrar sesión", ejecuta logout()
      }
    });
  }
}, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación para asegurar que los campos no estén vacíos
    const { email, password } = formData;
    if (!email || !password) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please fill in all fields.",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    await login(formData); // Enviamos los datos a la función login de auth.js
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
          <p>
            <Link to="/recovery"> Recover password?</Link>
          </p>
        </div>

        <div className="social-login">
          <p>Or sign in with</p>
          <div className="social-icons">
            <button className="icon-btn google"><FaGoogle /></button>
            <button className="icon-btn github"><FaGithub /></button>
            <button className="icon-btn twitter"><FaTwitter /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;