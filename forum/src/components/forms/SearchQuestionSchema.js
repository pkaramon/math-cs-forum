import * as Yup from "yup";

export const initialValues = {
  search: "",
  tags: [],
  sortBy: "addedAt",
  sortOrder: "desc",
};

export const sortOptions = [
  { value: "addedAt", label: "Added At" },
  { value: "modifiedAt", label: "Modified At" },
  { value: "likes", label: "Likes" },
  { value: "answers", label: "Answers" },
  { value: "views", label: "Views" },
];

export const sortOrderOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const SearchQuestionSchema = Yup.object().shape({
  search: Yup.string(),
  tags: Yup.array(),
  sortBy: Yup.string()
    .required("Required")
    .oneOf(sortOptions.map((o) => o.value)),
  sortOrder: Yup.string().required("Required").oneOf(["asc", "desc"]),
});

export default SearchQuestionSchema;
