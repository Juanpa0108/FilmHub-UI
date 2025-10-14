import React, { useState } from "react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa"; 
import "./register.css"; 
import useAuth from "../../API/auth.js";
import { Link, useNavigate } from "react-router-dom"; 
import AnimatedBackground from "../../components/particles/particles";
import logo from "../../assets/logo.png"; 


const Register = () => {
  const { register: registrarUsuario } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
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
      await registrarUsuario({email, username, password });
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="register-wrapper">
      <AnimatedBackground />
      <header id="header">
        <div id="header-content">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h2>Become a Cinephile</h2>
          <p className="subtitle">
            Look for the best-reviewed movies and save your favorites for later!
          </p>
        </div>
      </header>
      
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
          <button type="submit" className="btn-gradient" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="social-login-register">
          <p>Or sign up with</p>
          <div className="social-icons-register">
            <button className="icon-btn google"><FaGoogle /></button>
            <button className="icon-btn github"><FaGithub /></button>
            <button className="icon-btn twitter"><FaTwitter /></button>
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