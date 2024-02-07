import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useUserService } from "../context/UserServiceContext";
import useSnackbar from "../hooks/useSnackbar";
import routes from "../routing/routes";

function ResetPasswordPage() {
  const [alert, setAlert] = useState(null);
  const { token } = useParams();
  const userService = useUserService();
  const { showSnackbarThenRedirect, showSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
    userService
      .resetPassword(token, values.password)
      .then((message) => {
        showSnackbarThenRedirect(message, routes.login);
      })
      .catch((err) => {
        showSnackbar(err.message);
      });
  };

  try {
    const { exp: expirationTimeInSeconds } = jwtDecode(token);
    const expirationTimeInMilliseconds = expirationTimeInSeconds * 1000;
    const isTokenExpired = Date.now() > expirationTimeInMilliseconds;

    if (isTokenExpired && alert === null) {
      setAlert("The reset password link has expired");
    }
  } catch (err) {
    if (alert === null) setAlert("Invalid reset password link");
  }

  return (
    <>
      <ResetPasswordForm alert={alert} onSubmit={handleSubmit} />
    </>
  );
}
export default ResetPasswordPage;
