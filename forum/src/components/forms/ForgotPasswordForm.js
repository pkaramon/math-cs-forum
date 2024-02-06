import * as Yup from "yup";
import FormField from "./FormField";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { Alert, Avatar, Box, Button, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Form, Formik } from "formik";

const ForgoPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const initialValues = {
  email: "",
};

const ForgotPasswordForm = ({ alert, onSubmit }) => {
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
          Enter your email
        </Typography>

        <Box>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={ForgoPasswordSchema}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form>
                {alert && <Alert severity={"error"}>{alert}</Alert>}
                <FormField property={"email"} label={"Email"} />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!isValid || !dirty || isSubmitting}
                >
                  Send reset link
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPasswordForm;
