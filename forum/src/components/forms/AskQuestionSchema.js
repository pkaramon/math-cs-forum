import * as Yup from "yup";
import { markdownSample } from "../sampledata";

const AskQuestionSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  question: Yup.string().required("Question is required"),
  tags: Yup.array().of(Yup.string()).max(5, "You can only add up to 5 tags"),
});

export const initialValues = {
  title: "",
  question: markdownSample,
  tags: [],
  tagInput: "",
};

export default AskQuestionSchema;
