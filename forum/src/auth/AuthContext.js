import { createContext, useContext, useEffect, useState } from "react";
import * as roles from "./roles";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuthState] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : {};
  });

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const isAuthenticated = typeof auth?.token === "string";
  const role = auth?.role ?? roles.GUEST;

  const setAuth = (authData) => {
    const decodedPayload = jwtDecode(authData.token);

    setAuthState({
      token: authData.token,
      userId: decodedPayload["user_id"],
      role: decodedPayload["role"],
    });
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
