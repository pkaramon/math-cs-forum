import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { Alert, Avatar, Box, Button, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Form, Formik } from "formik";
import FormField from "./FormField";
import * as Yup from "yup";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().required("Required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const initialValues = {
  password: "",
  repeatPassword: "",
};

const ResetPasswordForm = ({ onSubmit, alert }) => {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Enter your new password
        </Typography>

        <Box>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={ResetPasswordSchema}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form>
                {alert && (
                  <Alert severity={"error"} sx={{ my: 2 }}>
                    {alert}
                  </Alert>
                )}
                <FormField
                  type={"password"}
                  property={"password"}
                  label={"Password"}
                />
                <FormField
                  property={"repeatPassword"}
                  label={"Repeat password"}
                  type={"password"}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={
                    !isValid || !dirty || isSubmitting || alert !== null
                  }
                >
                  Change password
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPasswordForm;
