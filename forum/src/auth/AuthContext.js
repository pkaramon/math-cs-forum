import { createContext, useContext, useState } from "react";
import * as roles from "./roles";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: "1234",
    userId: 21,
    role: roles.USER,
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
        role,
        userId: auth.userId,
        isAuthenticated,
        setAuth,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
