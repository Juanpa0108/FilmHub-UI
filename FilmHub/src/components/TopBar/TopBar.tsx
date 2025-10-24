import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuthContext } from "../../API/authContext";
import BrandLogo from "../BrandLogo/BrandLogo";
import LogoutButton from "../LogoutButton/LogoutButton";
import styles from "./TopBar.module.css";

// Paths where the top bar should be hidden
const HIDE_ON = new Set(["/login", "/register"]);

const TopBar: React.FC = () => {
  const { state } = useAuthContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Prevent rendering the TopBar on specific routes (like login/register)
  if (HIDE_ON.has(location.pathname)) return null;

  /**
   * Closes the user menu when clicking outside of it.
   * 
   * - We use a `ref` attached to the menu container (`menuRef`).
   * - When a click happens anywhere on the document, we check if the click
   *   target is NOT inside the menu. If not, we close the menu.
   * - The listener is cleaned up on component unmount to avoid memory leaks.
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/">
          <BrandLogo className={styles.logo} />
        </Link>
      </div>

      <div className={styles.right}>
        {state?.user ? (
          <div className={styles.menuWrap} ref={menuRef}>
            <button
              className={styles.avatarBtn}
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              title={state.user.username || state.user.email}
            >
              <FaUserCircle />
            </button>

            {open && (
              <div className={styles.menu} role="menu">
                <Link
                  className={styles.menuItem}
                  to="/profile"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <div className={styles.menuItem} role="menuitem">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login" className={styles.link}>
              Login
            </Link>
            <Link to="/register" className={styles.linkPrimary}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
