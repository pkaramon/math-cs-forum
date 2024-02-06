import * as Yup from "yup";

const QuestionSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  question: Yup.string().required("Question is required"),
  tags: Yup.array().of(Yup.string()).max(5, "You can only add up to 5 tags"),
});

export const initialValues = {
  title: "",
  question: "",
  tags: [],
  tagInput: "",
};

export default QuestionSchema;
