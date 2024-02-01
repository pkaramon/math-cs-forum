import React from "react";
import { Field, Form, Formik } from "formik";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Slider,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PersonRounded } from "@mui/icons-material";
import RegistrationSchema, {
  calculatePasswordStrength,
  getPasswordStrengthColor,
  initialValues,
} from "./RegistrationSchema";
import FormField from "./FormField";
import Container from "@mui/material/Container";
import routes from "../../routes";
import CssBaseline from "@mui/material/CssBaseline";

const FormComponent = () => {
  const onSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 400);
  };

  return (
    <Container component={"main"} maxWidth={"xs"} sx={{ height: "100vh" }}>
      <CssBaseline />
      <Box mt={4}>
        <Formik
          initialValues={initialValues}
          validationSchema={RegistrationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, isValid, dirty, values }) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <PersonRounded />
                </Avatar>
                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  align={"center"}
                >
                  Register
                </Typography>
              </Box>

              <FormField property={"firstName"} label={"First name"} />
              <FormField property={"lastName"} label={"Last Name"} />
              <FormField property={"email"} label={"Email"} />
              <FormField
                property={"password"}
                label={"Password"}
                type={"password"}
              />

              {values.password && (
                <>
                  <Typography>Password Strength</Typography>
                  <Slider
                    value={calculatePasswordStrength(values.password)}
                    color={getPasswordStrengthColor(
                      calculatePasswordStrength(values.password),
                    )}
                    sx={{
                      height: 8,
                      "& .MuiSlider-thumb": { display: "none" },
                    }}
                    margin="normal"
                  />
                </>
              )}

              <FormField
                property={"repeatPassword"}
                type={"password"}
                label={"Repeat Password"}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Field name="birthday" fullWidth margin={"normal"}>
                  {() => (
                    <DatePicker
                      label="Birthday"
                      value={values.birthday}
                      onChange={(date) => setFieldValue("birthday", date)}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          margin: "normal",
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                </Field>
              </LocalizationProvider>

              <Field name="acceptTerms" type="checkbox">
                {({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="I accept the terms and conditions"
                    margin={"normal"}
                  />
                )}
              </Field>
              <Button
                disabled={!(isValid && dirty)}
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 2, width: "100%" }}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>

        <Link href={routes.login} variant="body2">
          {"Already have an account? Sign in here."}
        </Link>
      </Box>
    </Container>
  );
};

export default FormComponent;
