/**
 * Recovery.tsx
 * -----------------------
 * Password recovery page component.
 * Allows the user to input their email address
 * and simulates sending a password recovery link.
 */

import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import "./recovery.css";

const Recovery: React.FC = () => {
  // State variables
  const [email, setEmail] = useState<string>(""); // Stores the user's email input
  const [message, setMessage] = useState<string>(""); // Success message
  const [error, setError] = useState<string>(""); // Error message

  /**
   * Handles email input changes.
   * Clears the error if the email becomes valid
   * and removes success message when editing again.
   */
  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Clear error only if the new email looks valid
    if (error && newEmail.includes("@") && newEmail.includes(".")) {
      setError("");
    }

    // Clear success message when user edits the email again
    if (message) setMessage("");
  };

  /**
   * Handles form submission.
   * Validates the email and shows success or error messages.
   */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      setMessage("");
      return;
    }

    // Simulate sending recovery link
    setError("");
    setMessage("If the email is registered, you will receive a recovery link.");
  };

  return (
    <div className="recovery-container">
      <h2>🔒 Password Recovery</h2>
      <p>Enter your email to receive a recovery link.</p>

      <form onSubmit={handleSubmit}>
        {/* Email input with icon */}
        <div className="input-container">
          <FiMail className="icon" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit">Send Link</button>
      </form>

      {/* Error and success messages */}
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Recovery;
