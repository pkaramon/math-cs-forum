import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Box, Button, Typography } from "@mui/material";
import MarkdownField from "./MarkdownField";

const initialValues = {
  answer: "",
};

const AnswerSchema = Yup.object().shape({
  answer: Yup.string().required("Answer is required"),
});

const AnswerForm = ({ onSubmit }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Answer
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={AnswerSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({ dirty, isValid }) => (
          <Form>
            <MarkdownField fieldName="answer" />
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || !dirty}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AnswerForm;
