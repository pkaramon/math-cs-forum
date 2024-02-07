import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import { useUserService } from "../context/UserServiceContext";
import useSnackbar from "../hooks/useSnackbar";

const ForgotPasswordPage = () => {
  const userService = useUserService();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const handleSubmit = (values, { setSubmitting }) => {
    userService
      .sendResetPasswordEmail(values.email)
      .then(({ message }) => {
        showSnackbar(message);
      })
      .catch(() => {
        const msg = "Could not send reset password email";
        showSnackbar(msg);
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
