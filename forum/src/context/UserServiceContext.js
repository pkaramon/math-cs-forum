import { createContext, useContext } from "react";
import ServerUserService from "../services/ServerUserService";

export const UserServiceContext = createContext();

export const useUserService = () => useContext(UserServiceContext);

export const UserServiceProvider = ({ children }) => {
  const serverUserService = new ServerUserService();

  return (
    <UserServiceContext.Provider value={serverUserService}>
      {children}
    </UserServiceContext.Provider>
  );
};
