import { createContext, useContext } from "react";
import FakeUserService from "../services/FakeUserService";
import ServerUserService from "../services/ServerUserService";

export const UserServiceContext = createContext();

export const useUserService = () => useContext(UserServiceContext);

export const UserServiceProvider = ({ children }) => {
  const userService = new FakeUserService();

  const serverUserService = new ServerUserService();

  return (
    <UserServiceContext.Provider value={serverUserService}>
      {children}
    </UserServiceContext.Provider>
  );
};
