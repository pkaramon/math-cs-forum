import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { useUserService } from "../context/UserServiceContext";
import LoadingIndicator from "../components/LoadingIndicator";
import EditUserDetailsForm from "../components/forms/EditUserDetailsForm";
import dayjs from "dayjs";
import routes from "../routes";
import useSnackbar from "../hooks/useSnackbar";

const EditUserDetailsPage = () => {
  const { userId, token } = useAuth();
  const userService = useUserService();
  const [userDetails, setUserDetails] = useState(null);
  const { showSnackbarThenRedirect, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    userService.getUserDetails(token, userId).then((userDetails) => {
      if (userDetails) {
        setUserDetails(userDetails);
      }
    });
  }, [userId, token, userService]);

  const onSubmit = (values) => {
    userService.updateUserDetails(token, userId, values).then((success) => {
      if (success) {
        showSnackbarThenRedirect(
          "User details updated successfully.",
          routes.profile,
        );
      }
    });
  };

  if (!userDetails) {
    return <LoadingIndicator isLoading={true} />;
  }

  return (
    <>
      <SnackbarComponent />

      <EditUserDetailsForm
        initialValues={{
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          about: userDetails.about,
          birthDate: dayjs(userDetails.birthDate),
        }}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default EditUserDetailsPage;
