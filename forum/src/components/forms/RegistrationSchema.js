import * as Yup from "yup";

const RegistrationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("Required")
    .min(6, "Password is too short - should be 6 chars minimum."),
  repeatPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match",
  ),
  birthDate: Yup.date().required("Required").nullable(),
  acceptTerms: Yup.bool().oneOf(
    [true],
    "You must accept the terms and conditions.",
  ),
});

export const calculatePasswordStrength = (password) => {
  return Math.min(100, password.length * 10);
};

export const getPasswordStrengthColor = (strength) => {
  return strength >= 70 ? "success" : "error";
};

export const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  repeatPassword: "",
  birthDate: null,
  acceptTerms: false,
};

export default RegistrationSchema;
