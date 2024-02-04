import { createContext, useContext, useState } from "react";
import * as roles from "./roles";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const isAuthenticated = typeof auth?.token === "string";
  const role = auth?.role ?? roles.GUEST;
  const clearAuthData = () => {
    setAuth({});
  };

  return (
    <AuthContext.Provider
      value={{ auth, role, isAuthenticated, setAuth, clearAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
