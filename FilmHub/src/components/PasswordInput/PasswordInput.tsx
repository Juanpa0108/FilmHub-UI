/**
 * PasswordInput.tsx
 *
 * A reusable and accessible password input field with a visibility toggle.
 * The component allows users to show or hide their password while typing,
 * improving usability without sacrificing security.
 *
 * @module PasswordInput
 */

import React, { useMemo, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./PasswordInput.module.css";

/**
 * Props definition for the PasswordInput component.
 */
export type PasswordInputProps = {
  /** Input field name attribute */
  name: string;

  /** Current value of the password input */
  value: string;

  /** Change event handler for updating the parent state */
  onChange: React.ChangeEventHandler<HTMLInputElement>;

  /** Placeholder text (default: `"Password"`) */
  placeholder?: string;

  /** Whether the field is required in a form (default: `false`) */
  required?: boolean;

  /** HTML autocomplete attribute (default: `"current-password"`) */
  autoComplete?: string;

  /** Additional CSS class name for custom styling */
  className?: string;

  /** Accessible label for screen readers (default: `"Password"`) */
  ariaLabel?: string;
};

/**
 * PasswordInput Component
 *
 * Renders a password input field with an eye icon button that toggles
 * visibility between plain text and obscured input. Designed to be
 * fully accessible with keyboard and screen reader support.
 *
 * @param {PasswordInputProps} props - Component properties.
 * @returns {JSX.Element} The rendered password input element.
 */
const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  value,
  onChange,
  placeholder = "Password",
  required = false,
  autoComplete = "current-password",
  className = "",
  ariaLabel = "Password",
}) => {
  // State that tracks whether the password is visible
  const [visible, setVisible] = useState(false);

  // Input type depends on visibility state
  const inputType = visible ? "text" : "password";

  // Memoized accessibility label for the toggle button
  const aria = useMemo(() => (visible ? "Hide password" : "Show password"), [visible]);

  return (
    <div className={`${styles.wrapper} ${className || ""}`.trim()}>
      {/* Password Input Field */}
      <input
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        className={styles.input}
      />

      {/* Visibility Toggle Button */}
      <button
        type="button"
        className={styles.toggle}
        aria-label={aria}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

export default PasswordInput;
