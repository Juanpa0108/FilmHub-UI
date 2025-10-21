import { useReducer, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { apiPath } from "../config/env";

const initialState = {
  user: null,
  accessToken: null,
};

// Acciones
const actions = {
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
};

// Reducer para manejar estado de autenticación
const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return { ...state, user: action.user, accessToken: action.accessToken };
    case actions.LOGOUT:
      return { ...state, user: null, accessToken: null };
    default:
      return state;
  }
};

// Función para calcular la expiración del token
const setExpirationDate = (seconds) => {
  return new Date().getTime() + seconds * 1000;
};



// Utilidad: fetch con timeout y abort
const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
};

let lastWarmTs = 0;
const warmUpServer = async () => {
  const now = Date.now();
  if (now - lastWarmTs < 60_000) return true; // evita calentar repetido en <60s
  try {
    const r = await fetchWithTimeout(apiPath("/health"), { cache: "no-store" }, 2500);
    lastWarmTs = Date.now();
    return r.ok;
  } catch (_) {
    return false;
  }
};

const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const sessionPromptActive = useRef(false);

  useEffect(() => {
    // Warm up API on first mount to avoid cold start delays (Render, etc.)
    warmUpServer();

    checkTokenExpiration();
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Verificar cada minuto

    // Keep-alive opcional para reducir cold start durante la sesión
    const keepAliveEnabled = Boolean(import.meta?.env?.VITE_API_KEEPALIVE);
    const keepAliveMs = Number(import.meta?.env?.VITE_API_KEEPALIVE_MS || 14 * 60 * 1000);
    const keepAliveId = keepAliveEnabled
      ? setInterval(() => {
          fetch(apiPath("/health"), { cache: "no-store" }).catch(() => {});
        }, keepAliveMs)
      : null;

    return () => {
      clearInterval(interval);
      if (keepAliveId) clearInterval(keepAliveId);
    };
  }, []);
  // Sincronizar el estado con el localStorage al cargar la página o al volver a la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const user = JSON.parse(localStorage.getItem("user"));
        const accessToken = localStorage.getItem("accessToken");

        if (user && accessToken) {
          dispatch({ type: actions.SET_USER, user, accessToken });
        }
        checkTokenExpiration(); // Verificar la expiración inmediatamente al volver
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const register = async (userInfo) => {
    try {
      const payload = {
        firstName: userInfo.firstName || userInfo.username,
        lastName: userInfo.lastName,
        age: userInfo.age,
        email: userInfo.email,
        password: userInfo.password,
      };
      const response = await fetch(apiPath("/api/users/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          if (response.status === 409 && errorData?.error) {
            alert(errorData.error);
            return;
          }
          alert(errorData?.error || "An unexpected error occurred");
        } catch (_e) {
          alert("An unexpected error occurred");
        }
      } else {
        navigate("/login");
        alert("Successfully registered user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const login = async (userInfo) => {
    try {
      // Calienta el servidor antes de intentar loguear
      warmUpServer();
      // Mensaje sutil por si el servidor está frío (sin UI visible aquí)
      let slowTimer = setTimeout(() => {
        try { console.info("Despertando servidor…") } catch {}
      }, 1500);
      let response;
      try {
        response = await fetchWithTimeout(apiPath(`/api/auth/login`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(userInfo),
        }, 15000);
      } catch (err) {
        // Un intento de reintento rápido si la 1a vez expiró/abortó
        try {
          await warmUpServer();
          response = await fetchWithTimeout(apiPath(`/api/auth/login`), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
            credentials: "include",
            body: JSON.stringify(userInfo),
          }, 15000);
        } catch (e2) {
          clearTimeout(slowTimer);
          throw new Error("El servidor tardó demasiado en responder. Intenta nuevamente.");
        }
      }
      clearTimeout(slowTimer);

      if (!response.ok) {
        // Try to read backend error (e.g., 400 validations, 401 invalid credentials)
        try {
          const err = await response.json();
          throw new Error(err?.error || "Error en la autenticación");
        } catch (_) {
          throw new Error("Error en la autenticación");
        }
      }

      const data = await response.json();
      // Support either {access, refresh, user} or {token, user}
      const accessToken = data.access || data.token;
      const refreshTokenValue = data.refresh; // may be undefined on this API
      const apiUser = data.user || {};
      if (accessToken && apiUser) {
        const user = {
          id: apiUser.id,
          email: apiUser.email,
          username: apiUser.username || apiUser.firstName || "",
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          expirationDate: setExpirationDate(2700),
        };

        dispatch({ type: actions.SET_USER, user, accessToken });
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        if (refreshTokenValue) {
          localStorage.setItem("refreshToken", refreshTokenValue);
        }

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1200,
        });

        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: "Invalid credentials, please try again!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "There was a problem logging in, try again!",
      });
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Limpieza agresiva para evitar rebotes por restos
      localStorage.clear();
    } catch {}
    // Intento de limpiar cookie de token si algún flujo la usa
    try { document.cookie = "authToken=; Max-Age=0; path=/;"; } catch {}
    dispatch({ type: actions.LOGOUT });
    navigate("/", { replace: true });
  };

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const checkTokenExpiration = async () => {
    if (sessionPromptActive.current) {
        console.log("⛔ Verificación bloqueada, ya hay una alerta activa");
        return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.expirationDate) return;

    const expirationTime = user.expirationDate;
    let currentTime = new Date().getTime();
    let remainingTime = expirationTime - currentTime;
    // Convertir milisegundos a minutos y segundos
    const minutes = Math.floor(remainingTime / 60000); // 🔹 Minutos
    const seconds = Math.floor((remainingTime % 60000) / 1000); // 🔹 Segundos
  
    console.log(`⏳"Remaining time:" ${minutes}m ${seconds}s`);
    sessionPromptActive.current = true; // ⛔ Bloqueamos ejecución antes de esperar

    // 🚨 Esperar 1 segundo ANTES de seguir
    await wait(1000);

    // 🔄 Verificar nuevamente
    currentTime = new Date().getTime();
    remainingTime = expirationTime - currentTime;
    if (remainingTime > 0 && remainingTime <= 5 * 60 * 1000) {
        const result = await Swal.fire({
            title: "⚠️ Your session is about to expire.",
            text: "Do you want to extend your session?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, extend",
            cancelButtonText: "Log Out",
            allowOutsideClick: false,
        });
        if (result.isConfirmed) {
          if (typeof refreshToken === "function") {
              await refreshToken(); // ✔️ Llamamos la función correcta
          } else {
              console.log("❌ refreshToken no es una función, cerrando sesión.");
              logout();
          }
      } else {
          logout();
      }

        // 🔓 Evitar nuevas alertas por 60 segundos
        setTimeout(() => {
            sessionPromptActive.current = false;
        }, 300000);
    } else {
        sessionPromptActive.current = false; // 🔓 Desbloquear si no se mostró alerta
    }
};


  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return logout();
      }
      const response = await fetch(apiPath("/api/users/refresh/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        console.error("❌ Falló la solicitud de refresh:", response.status, response.statusText);
        throw new Error("Failed to refresh token");
      }

      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error("❌ Error al parsear JSON de respuesta:", error);
        throw new Error("Respuesta no es JSON válido");
      }

      if (!data.access) {
        console.error("❌ No se recibió un accessToken en la respuesta.");
        throw new Error("El servidor no devolvió un nuevo token");
      }
      Swal.fire({
        icon: "success",
        title: "Tu sesión ha sido extendida",
        showConfirmButton: false,
        timer: 2000,
      });      
      const newExpiration = new Date().getTime() + 1800000;
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), expirationDate: newExpiration })
      );

      dispatch({
        type: actions.SET_USER,
        user: { ...state.user, expirationDate: newExpiration },
        accessToken: data.access,
      });
    } catch (error) {
      console.error("❌ Error al refrescar token:", error);
      logout();
    }
  };

  const updateProfile = async (updates) => {
    try {
      const token = state.accessToken || localStorage.getItem("accessToken");
      const response = await fetch(apiPath("/api/auth/user"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to update profile");
      }
      const data = await response.json();
      const updated = data.user || {};
      const newUser = {
        ...(JSON.parse(localStorage.getItem("user")) || {}),
        firstName: updated.firstName ?? state.user?.firstName,
        lastName: updated.lastName ?? state.user?.lastName,
        email: updated.email ?? state.user?.email,
        age: updated.age ?? state.user?.age,
      };
      localStorage.setItem("user", JSON.stringify(newUser));
      dispatch({ type: actions.SET_USER, user: newUser, accessToken: state.accessToken });
      Swal.fire({ icon: "success", title: "Profile updated", timer: 1500, showConfirmButton: false });
      return newUser;
    } catch (e) {
      Swal.fire({ icon: "error", title: "Update failed", text: e.message || "Try again later" });
      throw e;
    }
  };

  const changePassword = async ({ currentPassword, newPassword, confirmNewPassword }) => {
    try {
      const token = state.accessToken || localStorage.getItem("accessToken");
      const response = await fetch(apiPath("/api/auth/change-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to change password");
      }
      Swal.fire({ icon: "success", title: "Password changed", timer: 1500, showConfirmButton: false });
      return true;
    } catch (e) {
      Swal.fire({ icon: "error", title: "Change failed", text: e.message || "Try again later" });
      throw e;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = state.accessToken || localStorage.getItem("accessToken");
      if (!token) return null;
      const response = await fetch(apiPath("/api/auth/user"), {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (!response.ok) return null;
      const data = await response.json();
      const apiUser = data.user || {};
      const newUser = {
        ...(JSON.parse(localStorage.getItem("user")) || {}),
        id: apiUser.id,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        email: apiUser.email,
        age: apiUser.age,
      };
      localStorage.setItem("user", JSON.stringify(newUser));
      dispatch({ type: actions.SET_USER, user: newUser, accessToken: state.accessToken || localStorage.getItem("accessToken") });
      return newUser;
    } catch (_) {
      return null;
    }
  };

  return { state, register, login, logout, refreshToken, updateProfile, changePassword, fetchCurrentUser, user: state.user };
};

export default useAuth;