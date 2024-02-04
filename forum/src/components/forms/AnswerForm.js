import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Button } from "@mui/material";
import FormField from "./FormField";

const initialValues = {
  answer: "",
};

const AnswerSchema = Yup.object().shape({
  answer: Yup.string().required("Answer is required"),
});

const AnswerForm = ({}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AnswerSchema}
      onSubmit={() => {}}
    >
      {({ dirty, isValid }) => (
        <Form>
          <FormField
            property="answer"
            label="Answer"
            multiline
            rows={4}
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ height: 56 }}
            disabled={!isValid || !dirty}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};
