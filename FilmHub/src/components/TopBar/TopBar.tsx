import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuthContext } from "../../API/authContext";
import BrandLogo from "../BrandLogo/BrandLogo";
import LogoutButton from "../LogoutButton/LogoutButton";
import styles from "./TopBar.module.css";

const HIDE_ON = new Set(["/login", "/register"]);

const TopBar: React.FC = () => {
  const { state } = useAuthContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (HIDE_ON.has(location.pathname)) return null;

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/">
          <BrandLogo className={styles.logo} />
        </Link>
      </div>
      <div className={styles.right}>
        {state?.user ? (
          <div className={styles.menuWrap}>
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
                <Link className={styles.menuItem} to="/profile" role="menuitem" onClick={() => setOpen(false)}>
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
            <Link to="/login" className={styles.link}>Login</Link>
            <Link to="/register" className={styles.linkPrimary}>Register</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
