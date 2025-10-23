import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ className = "", children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on home/root or when there's no history to go back
  const isRoot = location.pathname === "/";
  // Hide specifically on profile to keep its built-in black back button
  const hideOnProfile = location.pathname.startsWith("/profile");
  if (isRoot || hideOnProfile) return null;

  return (
    <button
      type="button"
      aria-label="Go back"
      className={`back-button ${className}`}
      onClick={() => {
        const canGoBack = typeof window !== "undefined" && window.history && window.history.length > 1;
        if (canGoBack) navigate(-1);
        else navigate("/", { replace: true });
      }}
    >
      {children || "← Back"}
    </button>
  );
};

export default BackButton;
