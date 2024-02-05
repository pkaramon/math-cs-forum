import { createContext, useContext, useEffect, useState } from "react";
import * as roles from "./roles";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuthState] = useState(tryToGetAuthStateFromLocalStorage());

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const isAuthenticated = typeof auth?.token === "string";
  const role = auth?.role ?? roles.GUEST;

  const setAuth = (authData) => {
    const decodedPayload = jwtDecode(authData.token);
    const currentTime = Date.now() / 1000;

    if (decodedPayload.exp < currentTime) {
      clearAuthData();
    } else {
      setAuthState({
        token: authData.token,
        userId: decodedPayload.user_id,
        role: decodedPayload.role,
      });
    }
  };

  const clearAuthData = () => {
    setAuthState({});
    localStorage.removeItem("auth"); // Clear auth data from localStorage
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        token: auth.token,
        role,
        userId: auth.userId,
        isAuthenticated,
        isAdmin: role === roles.ADMIN && isAuthenticated,
        setAuth,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

function tryToGetAuthStateFromLocalStorage() {
  const storedAuth = localStorage.getItem("auth");
  if (storedAuth) {
    const { token } = JSON.parse(storedAuth);
    if (token && !isTokenExpired(token)) {
      const decodedPayload = jwtDecode(token);
      return {
        token,
        userId: decodedPayload.user_id,
        role: decodedPayload.role,
      };
    }
  }
  return {};
}

function isTokenExpired(token) {
  const decodedPayload = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedPayload.exp < currentTime;
}
