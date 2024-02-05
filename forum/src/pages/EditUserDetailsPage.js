import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { useUserService } from "../context/UserServiceContext";
import LoadingIndicator from "../components/LoadingIndicator";
import EditUserDetailsForm from "../components/forms/EditUserDetailsForm";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import routes from "../routes";

const EditUserDetailsPage = () => {
  const { userId, token } = useAuth();
  const userService = useUserService();
  const [userDetails, setUserDetails] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

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
        setOpenSnackbar(true);
        setTimeout(() => navigate(routes.profile), 2000);
      }
    });
  };

  if (!userDetails) {
    return <LoadingIndicator isLoading={true} />;
  }

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="User details updated successfully."
      />

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
