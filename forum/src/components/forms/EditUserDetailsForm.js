import * as Yup from "yup";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import FormField from "./FormField";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const EditUserDetailsSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  about: Yup.string().required("Required"),
  birthDate: Yup.date().required("Required").nullable(),
});

const EditUserDetailsForm = ({ initialValues, onSubmit }) => {
  return (
    <Box
      sx={{
        mt: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Card raised component={"main"} sx={{ p: 2, maxWidth: "md" }}>
        <CssBaseline />
        <Box mt={4}>
          <Formik
            initialValues={initialValues}
            validationSchema={EditUserDetailsSchema}
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
                  <Typography
                    variant="h5"
                    component="h1"
                    gutterBottom
                    align={"center"}
                  >
                    Edit your details
                  </Typography>
                </Box>

                <FormField property={"firstName"} label={"First name"} />
                <FormField property={"lastName"} label={"Last Name"} />
                <FormField
                  property={"about"}
                  label={"About"}
                  render={({ field, form, ...other }) => (
                    <TextField
                      {...field}
                      {...other}
                      fullWidth
                      rows={6}
                      multiline
                      variant={"outlined"}
                    />
                  )}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Field name="birthDate" fullWidth margin={"normal"}>
                    {() => (
                      <DatePicker
                        label="BirthDate"
                        value={values.birthDate}
                        onChange={(date) => setFieldValue("birthDate", date)}
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

                <Button
                  disabled={!isValid}
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
        </Box>
      </Card>
    </Box>
  );
};

export default EditUserDetailsForm;
