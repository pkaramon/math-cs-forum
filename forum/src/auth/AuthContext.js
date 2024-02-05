import { createContext, useContext, useState } from "react";
import * as roles from "./roles";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: "1234",
    userId: 100,
    role: "admin",
  });
  const isAuthenticated = typeof auth?.token === "string";
  const role = auth?.role ?? roles.GUEST;

  const clearAuthData = () => {
    setAuth({});
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
