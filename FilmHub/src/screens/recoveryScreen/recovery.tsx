import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import "./recovery.css";

const Recovery: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Solo limpiar error si el email ahora es válido
    if (error && newEmail.includes("@") && newEmail.includes(".")) {
      setError("");
    }

    // Limpiar mensaje de éxito cuando el usuario modifica el email
    if (message) setMessage("");
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!email.includes("@") || !email.includes(".")) {
      setError("Por favor, ingresa un correo válido.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("Si el correo está registrado, recibirás un enlace de recuperación.");
  };

  return (
    <div className="recovery-container">
      <h2>🔒 Recuperar Contraseña</h2>
      <p>Ingresa tu correo para recibir un enlace de recuperación.</p>

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <FiMail className="icon" />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        <button type="submit">Enviar enlace</button>
      </form>

      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Recovery;
