import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import { useUserService } from "../context/UserServiceContext";
import useSnackbar from "../hooks/useSnackbar";

const ForgotPasswordPage = () => {
  const userService = useUserService();
  const { showSnackbarThenRedirect, showSnackbar, SnackbarComponent } =
    useSnackbar();
  const handleSubmit = (values, { setSubmitting }) => {
    userService
      .sendResetPasswordEmail(values.email)
      .then(({ message }) => {
        showSnackbar(message);
      })
      .catch(() => {
        showSnackbar("Could not send reset password email");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  return (
    <>
      <SnackbarComponent />
      <ForgotPasswordForm onSubmit={handleSubmit} />
    </>
  );
};

export default ForgotPasswordPage;
