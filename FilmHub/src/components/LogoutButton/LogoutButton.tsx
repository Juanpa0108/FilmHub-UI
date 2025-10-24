/**
 * LogoutButton Component
 * ----------------------
 * Provides a secure and interactive way for users to end their session.
 * Displays a confirmation popup before logging out to prevent accidental actions.
 * 
 * Dependencies:
 * - React
 * - react-router-dom (for navigation)
 * - SweetAlert2 (for confirmation dialogs)
 * - useAuthContext (custom context that manages authentication)
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthContext } from "../../API/authContext";

/**
 * Functional component that handles user logout with confirmation.
 */
const LogoutButton: React.FC = () => {
  // Extracts the logout function from the authentication context.
  // 'logout' is responsible for clearing user data and redirecting to "/login".
  const { logout } = useAuthContext() as any;

  // Hook from react-router-dom for navigation (used as fallback if needed)
  const navigate = useNavigate();

  /**
   * Handles the logout flow.
   * Shows a confirmation popup and executes logout if the user confirms.
   */
  const handleLogout = async (): Promise<void> => {
    // Display confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Log out?",
      text: "Are you sure you want to end your session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    });

    // If the user confirms, execute the logout process
    if (result.isConfirmed) {
      logout(); // The logout function handles session cleanup and navigation
    }
  };

  return (
    /**
     * Logout button that triggers the handleLogout() function.
     * The className "logout-btn" can be styled using external CSS.
     */
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
};

export default LogoutButton;
