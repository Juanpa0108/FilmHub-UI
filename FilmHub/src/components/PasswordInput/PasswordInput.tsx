import React, { useMemo, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./PasswordInput.module.css";

export type PasswordInputProps = {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string; // allow parent to pass extra classNames
  ariaLabel?: string;
};

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
  const [visible, setVisible] = useState(false);
  const inputType = visible ? "text" : "password";
  const aria = useMemo(() => (visible ? "Hide password" : "Show password"), [visible]);

  return (
    <div className={`${styles.wrapper} ${className || ""}`.trim()}>
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
