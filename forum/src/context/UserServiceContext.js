import { createContext, useContext } from "react";
import FakeUserService from "../services/FakeUserService";

export const UserServiceContext = createContext();

export const useUserService = () => useContext(UserServiceContext);

export const UserServiceProvider = ({ children }) => {
  const userService = new FakeUserService();
  return (
    <UserServiceContext.Provider value={userService}>
      {children}
    </UserServiceContext.Provider>
  );
};
