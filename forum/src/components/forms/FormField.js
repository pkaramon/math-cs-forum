import { Field, useFormikContext } from "formik";
import { TextField } from "@mui/material";
import React from "react";

const FormField = ({ property, label, children, ...other }) => {
  const { errors, touched } = useFormikContext();
  return (
    <Field
      name={property}
      as={TextField}
      label={label}
      fullWidth
      error={touched[property] && Boolean(errors[property])}
      helperText={touched[property] && errors[property]}
      margin="normal"
      {...other}
    >
      {children}
    </Field>
  );
};

export default FormField;
