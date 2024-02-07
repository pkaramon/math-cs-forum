import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { useUserService } from "../context/UserServiceContext";
import LoadingIndicator from "../components/LoadingIndicator";
import EditUserDetailsForm from "../components/forms/EditUserDetailsForm";
import dayjs from "dayjs";
import routes from "../routing/routes";
import useSnackbar from "../hooks/useSnackbar";

const EditUserDetailsPage = () => {
  const { userId, token } = useAuth();
  const userService = useUserService();
  const [userDetails, setUserDetails] = useState(null);
  const { showSnackbarThenRedirect } = useSnackbar();

  useEffect(() => {
    userService.getUserDetails(token).then((userDetails) => {
      if (userDetails) {
        setUserDetails(userDetails);
      }
    });
  }, [userId, token, userService]);

  const onSubmit = (values) => {
    userService
      .updateUserDetails(token, values)
      .then(() => {
        showSnackbarThenRedirect(
          "User details updated successfully.",
          routes.profile,
        );
      })
      .catch((err) => {
        showSnackbarThenRedirect(err.message, routes.profile);
      });
  };

  if (!userDetails) {
    return <LoadingIndicator isLoading={true} />;
  }

  return (
    <>
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
