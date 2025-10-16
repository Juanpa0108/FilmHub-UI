import React, { useState } from "react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import "./register.css";
import useAuth from "../../API/auth.js";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "../../components/particles/particles";
import BrandLogo from "../../components/BrandLogo/BrandLogo"; // ✅ agrega esta línea

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const { register: registrarUsuario } = useAuth() as {
    register: (data: { email: string; username: string; password: string }) => Promise<void>;
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await registrarUsuario({ email, username, password });
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <AnimatedBackground />
      <header id="header">
        <div id="header-content">
          <div className="logo">
            <BrandLogo className="logo" /> {/* ✅ reemplaza <img src={logo} ... /> */}
          </div>
          <h2>Become a Cinephile</h2>
          <p className="subtitle">
            Look for the best-reviewed movies and save your favorites for later!
          </p>
        </div>
      </header>

      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-gradient" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="social-login-register">
          <p>Or sign up with</p>
          <div className="social-icons-register">
            <button className="icon-btn google" type="button"><FaGoogle /></button>
            <button className="icon-btn github" type="button"><FaGithub /></button>
            <button className="icon-btn twitter" type="button"><FaTwitter /></button>
          </div>
        </div>

        <p className="login-link">
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
