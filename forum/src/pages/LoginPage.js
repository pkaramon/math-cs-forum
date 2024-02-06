import LoginForm from "../components/forms/LoginForm";
import { useAuth } from "../auth/AuthContext";
import routes from "../routing/routes";
import { useNavigate } from "react-router-dom";
import { useUserService } from "../context/UserServiceContext";
import { useState } from "react";

const LoginPage = () => {
  const { setAuth } = useAuth();
  const userService = useUserService();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const handleSubmit = (values) => {
    userService
      .authenticate(values.email, values.password)
      .then((userAuthData) => {
        setAuth({ token: userAuthData.token });
        navigate(routes.profile);
      })
      .catch((err) => setAlert(err.message));
  };

  return <LoginForm handleSubmit={handleSubmit} alert={alert} />;
};

export default LoginPage;
