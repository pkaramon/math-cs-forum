import RegistrationForm from "../components/forms/RegistrationForm";
import { useUserService } from "../context/UserServiceContext";
import { Snackbar } from "@mui/material";
import { useState } from "react";
import routes from "../routing/routes";
import { useNavigate } from "react-router-dom";

export const RegistrationPage = () => {
  const userService = useUserService();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const onSubmit = (values) => {
    userService
      .register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        birthDate: values.birthDate,
      })
      .then((user) => {
        if (user) {
          setOpenSnackbar(true);
          setTimeout(() => navigate(routes.login), 2000);
        }
      })
      .catch((err) => {
        setAlert(err.message);
      });
  };
  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Successfully registered, you can now login."
      />
      <RegistrationForm onSubmit={onSubmit} alert={alert} />
    </>
  );
};
export default RegistrationPage;
