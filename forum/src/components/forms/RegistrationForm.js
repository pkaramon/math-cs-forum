import React from "react";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Slider,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RegistrationSchema, {
  calculatePasswordStrength,
  getPasswordStrengthColor,
  initialValues,
} from "./RegistrationSchema";
import FormField from "./FormField";

const FormComponent = () => {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Card raised>
          <Box m={3}>
            <Formik
              initialValues={initialValues}
              validationSchema={RegistrationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({
                setFieldValue,
                isValid,
                dirty,
                values,
                handleChange,
                handleBlur,
              }) => (
                <Form>
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                      Register
                    </Typography>

                    <Divider variant="middle" />

                    <FormField property={"firstName"} label={"First name"} />
                    <FormField property={"lastName"} label={"Last Name"} />
                    <FormField property={"email"} label={"Email"} />
                    <FormField
                      property={"password"}
                      label={"Password"}
                      type={"password"}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                          control={
                            <Checkbox {...field} checked={field.value} />
                          }
                          label="I accept the terms and conditions"
                          margin={"normal"}
                        />
                      )}
                    </Field>
                  </CardContent>
                  <CardActions>
                    <Button
                      disabled={!(isValid && dirty)}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                  </CardActions>
                </Form>
              )}
            </Formik>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FormComponent;
