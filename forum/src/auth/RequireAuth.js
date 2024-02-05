import { Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AuthRequiredDialog from "./AuthRequiredDialog";

const RequireAuth = ({ roles = [] }) => {
  const { isAuthenticated, role } = useAuth();

  return isAuthenticated && roles.includes(role) ? (
    <Outlet />
  ) : (
    <AuthRequiredDialog
      title={"In order to do that you need to login."}
      text={"Would you like to go to login page?"}
    />
  );
};

export default RequireAuth;
