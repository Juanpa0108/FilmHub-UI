import { useReducer, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { apiPath } from "../config/env";

// =============================
// TIPOS E INTERFACES
// =============================

export interface User {
  id: string | number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  age?: number;
  expirationDate: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
}

export interface RegisterInfo {
  firstName?: string;
  lastName: string;
  username?: string;
  age: number;
  email: string;
  password: string;
}

export interface LoginInfo {
  email: string;
  password: string;
}

interface ApiUser {
  id: string | number;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  age?: number;
}

interface LoginResponse {
  access?: string;
  token?: string;
  refresh?: string;
  user?: ApiUser;
}

interface RefreshResponse {
  access: string;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UseAuthReturn {
  state: AuthState;
  register: (userInfo: RegisterInfo) => Promise<void>;
  login: (userInfo: LoginInfo) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: UpdateProfileData) => Promise<User>;
  changePassword: (data: ChangePasswordData) => Promise<boolean>;
  fetchCurrentUser: () => Promise<User | null>;
  deleteAccount: (password: string) => Promise<boolean>;
  user: User | null;
  isAuthenticated: boolean;
}

// =============================
// CONSTANTES Y TIPOS DE ACCIONES
// =============================

const actions = {
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
} as const;

type ActionType = 
  | { type: typeof actions.SET_USER; user: User; accessToken: string }
  | { type: typeof actions.LOGOUT };

// =============================
// FUNCIONES AUXILIARES
// =============================

const loadInitialState = (): AuthState => {
  try {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    
    if (user && accessToken) {
      return {
        user: JSON.parse(user) as User,
        accessToken: accessToken,
      };
    }
  } catch (error) {
    console.error("Error loading initial state:", error);
  }
  
  return {
    user: null,
    accessToken: null,
  };
};

const reducer = (state: AuthState, action: ActionType): AuthState => {
  switch (action.type) {
    case actions.SET_USER:
      return { ...state, user: action.user, accessToken: action.accessToken };
    case actions.LOGOUT:
      return { ...state, user: null, accessToken: null };
    default:
      return state;
  }
};

const setExpirationDate = (seconds: number): number => {
  return new Date().getTime() + seconds * 1000;
};

const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = 15000
): Promise<Response> => {
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
const warmUpServer = async (): Promise<boolean> => {
  const now = Date.now();
  if (now - lastWarmTs < 60_000) return true;
  try {
    const r = await fetchWithTimeout(apiPath("/health"), { cache: "no-store" }, 2500);
    lastWarmTs = Date.now();
    return r.ok;
  } catch (_) {
    return false;
  }
};

const wait = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// =============================
// HOOK PRINCIPAL
// =============================

const useAuth = (): UseAuthReturn => {
  const [state, dispatch] = useReducer(reducer, loadInitialState());
  const navigate = useNavigate();
  const sessionPromptActive = useRef<boolean>(false);

  useEffect(() => {
    warmUpServer();
    checkTokenExpiration();
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

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

  // Notificar a oyentes globales cuando cambie el estado de autenticación
  useEffect(() => {
    try {
      const detail = { isAuthenticated: !!state.user && !!state.accessToken, user: state.user };
      window.dispatchEvent(new CustomEvent('auth:changed', { detail }));
    } catch {}
  }, [state.user, state.accessToken]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const userStr = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");

        if (userStr && accessToken) {
          const user = JSON.parse(userStr) as User;
          dispatch({ type: actions.SET_USER, user, accessToken });
        }
        checkTokenExpiration();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const register = async (userInfo: RegisterInfo): Promise<void> => {
    try {
      const payload = {
        firstName: userInfo.firstName || userInfo.username || "",
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
            Swal.fire({ icon: "error", title: "Error", text: errorData.error });
            return;
          }
          Swal.fire({ 
            icon: "error", 
            title: "Error", 
            text: errorData?.error || "An unexpected error occurred" 
          });
        } catch (_e) {
          Swal.fire({ icon: "error", title: "Error", text: "An unexpected error occurred" });
        }
      } else {
        Swal.fire({ 
          icon: "success", 
          title: "Success", 
          text: "Successfully registered user", 
          timer: 1500 
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Network error" });
    }
  };

  const login = async (userInfo: LoginInfo): Promise<void> => {
    try {
      // Mostrar feedback rápido y comenzar el login de inmediato
      Swal.fire({
        title: 'Iniciando sesión...',
        text: 'Verificando credenciales',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Despertar el servidor en paralelo (no bloquea el login)
      warmUpServer().catch(() => {});

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      let response: Response;
      try {
        response = await fetch(apiPath("/api/auth/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(userInfo),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (err) {
        clearTimeout(timeoutId);
        Swal.close();
        
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error("El servidor tardó demasiado. Intenta de nuevo.");
        }
        throw new Error("No se pudo conectar con el servidor.");
      }

      if (!response.ok) {
        Swal.close();
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Credenciales inválidas");
      }

      const data: LoginResponse = await response.json();
      const accessToken = data.access || data.token;
      const refreshTokenValue = data.refresh;
      const apiUser = data.user;

      if (!accessToken || !apiUser) {
        Swal.close();
        throw new Error("Respuesta inválida del servidor");
      }

      const user: User = {
        id: apiUser.id,
        email: apiUser.email,
        username: apiUser.username || apiUser.firstName || "",
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        age: apiUser.age,
        expirationDate: setExpirationDate(2700),
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      if (refreshTokenValue) {
        localStorage.setItem("refreshToken", refreshTokenValue);
      }

  dispatch({ type: actions.SET_USER, user, accessToken });

  // Opcional: asegurar datos frescos del servidor sin bloquear la navegación
  fetchCurrentUser().catch(() => {});

      // Forzar recarga completa para que toda la app reconozca el estado sin inconsistencias
      try { Swal.close(); } catch {}
      window.location.replace("/");

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Hubo un problema al iniciar sesión",
      });
    }
  };

  const logout = (): void => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch {}
    dispatch({ type: actions.LOGOUT });
    navigate("/login", { replace: true });
  };

  const checkTokenExpiration = async (): Promise<void> => {
    if (sessionPromptActive.current) {
      return;
    }
    
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    
    const user: User = JSON.parse(storedUser);
    if (!user.expirationDate) return;

    const expirationTime = user.expirationDate;
    const currentTime = new Date().getTime();
    const remainingTime = expirationTime - currentTime;

    if (remainingTime <= 0) {
      logout();
      return;
    }

    if (remainingTime <= 5 * 60 * 1000) {
      sessionPromptActive.current = true;
      await wait(1000);

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
        await refreshToken();
      } else {
        logout();
      }

      setTimeout(() => {
        sessionPromptActive.current = false;
      }, 300000);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (!refreshTokenValue) {
        return logout();
      }
      
      const response = await fetch(apiPath("/api/users/refresh/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshTokenValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data: RefreshResponse = await response.json();

      if (!data.access) {
        throw new Error("No access token received");
      }

      Swal.fire({
        icon: "success",
        title: "Tu sesión ha sido extendida",
        showConfirmButton: false,
        timer: 2000,
      });

      const newExpiration = new Date().getTime() + 2700000;
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}") as User;
      const updatedUser: User = { ...storedUser, expirationDate: newExpiration };

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      dispatch({
        type: actions.SET_USER,
        user: updatedUser,
        accessToken: data.access,
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  };

  const updateProfile = async (updates: UpdateProfileData): Promise<User> => {
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
      const updated: Partial<ApiUser> = data.user || {};
      const storedUser: User = JSON.parse(localStorage.getItem("user") || "{}");
      
      const newUser: User = {
        ...storedUser,
        firstName: updated.firstName ?? storedUser.firstName,
        lastName: updated.lastName ?? storedUser.lastName,
        email: updated.email ?? storedUser.email,
        age: updated.age ?? storedUser.age,
      };
      
      localStorage.setItem("user", JSON.stringify(newUser));
      dispatch({ type: actions.SET_USER, user: newUser, accessToken: state.accessToken! });
      Swal.fire({ 
        icon: "success", 
        title: "Profile updated", 
        timer: 1500, 
        showConfirmButton: false 
      });
      return newUser;
    } catch (e) {
      Swal.fire({ 
        icon: "error", 
        title: "Update failed", 
        text: e instanceof Error ? e.message : "Try again later" 
      });
      throw e;
    }
  };

  const changePassword = async (data: ChangePasswordData): Promise<boolean> => {
    try {
      const token = state.accessToken || localStorage.getItem("accessToken");
      const response = await fetch(apiPath("/api/auth/change-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to change password");
      }
      
      Swal.fire({ 
        icon: "success", 
        title: "Password changed", 
        timer: 1500, 
        showConfirmButton: false 
      });
      return true;
    } catch (e) {
      Swal.fire({ 
        icon: "error", 
        title: "Change failed", 
        text: e instanceof Error ? e.message : "Try again later" 
      });
      throw e;
    }
  };

  const fetchCurrentUser = async (): Promise<User | null> => {
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
      const apiUser: ApiUser = data.user || {};
      const storedUser: Partial<User> = JSON.parse(localStorage.getItem("user") || "{}");
      
      const newUser: User = {
        ...storedUser as User,
        id: apiUser.id,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        email: apiUser.email,
        age: apiUser.age,
      };
      
      localStorage.setItem("user", JSON.stringify(newUser));
      dispatch({ type: actions.SET_USER, user: newUser, accessToken: token });
      return newUser;
    } catch (_) {
      return null;
    }
  };

  const deleteAccount = async (password: string): Promise<boolean> => {
    try {
      const token = state.accessToken || localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No autenticado");
      }

      const response = await fetch(apiPath("/api/auth/user"), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo eliminar la cuenta");
      }

      Swal.fire({
        icon: "success",
        title: "Cuenta eliminada",
        text: "Tu cuenta ha sido eliminada.",
        timer: 1800,
        showConfirmButton: false,
      });

      // Clean up session and redirect
      logout();
      return true;
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e instanceof Error ? e.message : "Intenta de nuevo más tarde",
      });
      return false;
    }
  };

  return { 
    state, 
    register, 
    login, 
    logout, 
    refreshToken, 
    updateProfile, 
    changePassword, 
    fetchCurrentUser,
    deleteAccount,
    user: state.user,
    isAuthenticated: !!state.user && !!state.accessToken
  };
};

export default useAuth;