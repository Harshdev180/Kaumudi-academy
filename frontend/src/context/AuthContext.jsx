import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../lib/api";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
    // eslint-disable-next-line no-empty
  } catch {}
  return null;
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("kaumudi_session_started")) {
      localStorage.removeItem("kaumudi_token");
      localStorage.removeItem("kaumudi_user_email");
      localStorage.removeItem("kaumudi_user_id");
      localStorage.removeItem("kaumudi_role");
      localStorage.removeItem("kaumudi_user_first_name");
      localStorage.removeItem("kaumudi_user_last_name");
      localStorage.removeItem("kaumudi_user_name");
      setAuthToken(null);
      sessionStorage.setItem("kaumudi_session_started", "1");
    }
    const storedToken = localStorage.getItem("kaumudi_token");
    const storedEmail = localStorage.getItem("kaumudi_user_email");
    const storedRole = localStorage.getItem("kaumudi_role");
    const storedId = localStorage.getItem("kaumudi_user_id");
    const storedFirstName = localStorage.getItem("kaumudi_user_first_name");
    const storedLastName = localStorage.getItem("kaumudi_user_last_name");
    const storedName = localStorage.getItem("kaumudi_user_name");

    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken);
      // derive user from stored values and token payload
      const payload = decodeJwt(storedToken) || {};
      const firstName =
        storedFirstName || payload.firstName || payload.firstname || null;
      const lastName =
        storedLastName || payload.lastName || payload.lastname || null;
      const name =
        storedName ||
        payload.name ||
        payload.fullName ||
        (firstName || lastName
          ? [firstName, lastName].filter(Boolean).join(" ")
          : null);
      setUser({
        id: storedId || payload.id || payload._id || null,
        email: storedEmail,
        role: storedRole || payload.role,
        firstName,
        lastName,
        name,
      });
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    // store token and derive id/role from it if possible
    setToken(authToken);
    localStorage.setItem("kaumudi_token", authToken);
    setAuthToken(authToken);

    const payload = decodeJwt(authToken) || {};
    const id = payload.id || payload._id || null;
    const role = userData.role || payload.role || "STUDENT";
    const firstName = userData.firstName || userData.firstname || null;
    const lastName = userData.lastName || userData.lastname || null;
    const name =
      userData.name ||
      userData.fullName ||
      (firstName || lastName
        ? [firstName, lastName].filter(Boolean).join(" ")
        : null);

    const nextUser = {
      id,
      email: userData.email,
      role,
      firstName,
      lastName,
      name,
    };

    setUser(nextUser);
    if (nextUser.email)
      localStorage.setItem("kaumudi_user_email", nextUser.email);
    if (nextUser.id) localStorage.setItem("kaumudi_user_id", nextUser.id);
    if (firstName) localStorage.setItem("kaumudi_user_first_name", firstName);
    else localStorage.removeItem("kaumudi_user_first_name");
    if (lastName) localStorage.setItem("kaumudi_user_last_name", lastName);
    else localStorage.removeItem("kaumudi_user_last_name");
    if (name) localStorage.setItem("kaumudi_user_name", name);
    else localStorage.removeItem("kaumudi_user_name");
    localStorage.setItem("kaumudi_role", role);
  };

  const logout = (redirectTo = "/") => {
    setUser(null);
    setToken(null);
    // Clear all possible localStorage keys
    const keysToRemove = [
      "kaumudi_token",
      "kaumudi_user_email",
      "kaumudi_user_id",
      "kaumudi_role",
      "kaumudi_user_first_name",
      "kaumudi_user_last_name",
      "kaumudi_user_name",
      "kaumudi_user_name_hindi",
      "kaumudi_user_name_sanskrit",
      "kaumudi_user_phone",
      "kaumudi_user_whatsapp",
      "kaumudi_user_address",
      "token", // Just in case admin keys are mixed
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    sessionStorage.removeItem("kaumudi_session_started");

    setAuthToken(null);
    try {
      navigate(redirectTo || "/");
      // eslint-disable-next-line no-empty
    } catch {}
  };

  const updateUser = (updatedUserData) => {
    setUser((prevUser) => {
      const nextUser = { ...prevUser, ...updatedUserData };

      // Also update name if firstName or lastName changed
      if (
        updatedUserData.firstName !== undefined ||
        updatedUserData.lastName !== undefined
      ) {
        const firstName = nextUser.firstName || null;
        const lastName = nextUser.lastName || null;
        nextUser.name = [firstName, lastName].filter(Boolean).join(" ") || null;
      }

      // Sync with localStorage
      if (nextUser.email)
        localStorage.setItem("kaumudi_user_email", nextUser.email);
      if (nextUser.id) localStorage.setItem("kaumudi_user_id", nextUser.id);
      if (nextUser.firstName)
        localStorage.setItem("kaumudi_user_first_name", nextUser.firstName);
      else localStorage.removeItem("kaumudi_user_first_name");
      if (nextUser.lastName)
        localStorage.setItem("kaumudi_user_last_name", nextUser.lastName);
      else localStorage.removeItem("kaumudi_user_last_name");
      if (nextUser.name)
        localStorage.setItem("kaumudi_user_name", nextUser.name);
      else localStorage.removeItem("kaumudi_user_name");
      if (nextUser.role) localStorage.setItem("kaumudi_role", nextUser.role);

      return nextUser;
    });
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
