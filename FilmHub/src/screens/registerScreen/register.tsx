import React, { useState } from "react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import "./register.css";
import useAuth from "../../API/auth.js";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "../../components/particles/particles";
import BrandLogo from "../../components/BrandLogo/BrandLogo"; // ✅ agrega esta línea

type FormData = {
  username: string;
  lastName: string;
  age: string; // keep as string for input, convert on submit
  email: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const { register: registrarUsuario } = useAuth() as {
    register: (data: { email: string; username: string; password: string; lastName?: string; age?: number }) => Promise<void>;
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Estado para requisitos y progreso
  const [requirements, setRequirements] = useState({
    username: false,
    lastName: false,
    age: false,
    email: false,
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    confirm: false,
  });

  // Utility to compute progress percentage
  const computeProgress = (reqs: typeof requirements) => {
    const keys = Object.keys(reqs);
    const satisfied = keys.filter((k) => (reqs as any)[k]).length;
    return Math.round((satisfied / keys.length) * 100);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update inline validations as user types
    setRequirements((prev) => {
      const next = { ...prev } as any;
      if (name === "username") next.username = value.trim().length > 0;
      if (name === "lastName") next.lastName = value.trim().length > 0;
      if (name === "age") {
        const n = Number(value);
        next.age = value.trim() !== "" && Number.isFinite(n) && n >= 13 && n <= 120;
      }
      if (name === "email") {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        next.email = re.test(value.trim());
      }
      if (name === "password") {
        const val = value || "";
        next.length = val.length >= 8;
        next.uppercase = /[A-Z]/.test(val);
        next.lowercase = /[a-z]/.test(val);
        next.number = /\d/.test(val);
        next.special = /[^A-Za-z0-9]/.test(val);
        // also update confirm when password changes
        next.confirm = formData.confirmPassword === val && val.length > 0;
      }
      if (name === "confirmPassword") {
        next.confirm = value === formData.password && value.length > 0;
      }
      return next as typeof requirements;
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  const { username, lastName, age, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (age && (Number.isNaN(Number(age)) || Number(age) < 0)) {
      alert("Please enter a valid age.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

  setIsLoading(true);
    try {
  await registrarUsuario({ email, username, password, lastName, age: age ? Number(age) : undefined });
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
            <Link to="/">
              <BrandLogo className="logo" />
            </Link>
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
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            min={0}
            value={formData.age}
            onChange={handleChange}
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
          {/* Progress bar and requirements */}
          <div className="requirements-wrapper">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${computeProgress(requirements)}%` }}
                aria-hidden
              />
            </div>
            <ul className="req-list">
              <li className={requirements.username ? "satisfied" : ""}>Username filled</li>
              <li className={requirements.lastName ? "satisfied" : ""}>Last name filled</li>
              <li className={requirements.age ? "satisfied" : ""}>Age ≥ 13</li>
              <li className={requirements.email ? "satisfied" : ""}>Valid email</li>
              <li className={requirements.length ? "satisfied" : ""}>Password ≥ 8 chars</li>
              <li className={requirements.uppercase ? "satisfied" : ""}>Has uppercase</li>
              <li className={requirements.lowercase ? "satisfied" : ""}>Has lowercase</li>
              <li className={requirements.number ? "satisfied" : ""}>Has number</li>
              <li className={requirements.special ? "satisfied" : ""}>Has special char</li>
              <li className={requirements.confirm ? "satisfied" : ""}>Passwords match</li>
            </ul>
          </div>
          <button type="submit" className="btn-gradient" disabled={isLoading || computeProgress(requirements) < 100}>
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
