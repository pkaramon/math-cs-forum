import React from "react";
import { FieldArray, Form, Formik } from "formik";
import {
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import FormField from "./FormField";
import QuestionSchema, {
  initialValues as questionInitialValues,
} from "./QuestionSchema";
import MarkdownField from "./MarkdownField";

const QuestionForm = ({
  onSubmit,
  initialValues = questionInitialValues,
  title = "",
}) => {
  const handleKeyDownInTagInput = (e, values, setFieldValue) => {
    if (e.key === "Enter" && e.target.value !== "") {
      e.preventDefault();
      setFieldValue("tags", [...values.tags, e.target.value]);
      setFieldValue("tagInput", ""); // Clear the input
    }
  };

  const handleTagDelete = (tagToDelete, values, setFieldValue) => {
    setFieldValue(
      "tags",
      values.tags.filter((tag) => tag !== tagToDelete),
    );
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 10 }}>
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={QuestionSchema}
        >
          {({ isValid, dirty, values, setFieldValue, errors, touched }) => (
            <Form>
              <Typography variant="h6" gutterBottom>
                {title}
              </Typography>
              <FormField property={"title"} label={"Title"} />
              <Typography variant="body1" sx={{ my: 2 }}>
                Question
              </Typography>

              <MarkdownField fieldName={"question"} />
              <Box sx={{ my: 2 }}>
                <Typography variant="body1" sx={{ my: 2 }}>
                  Tags
                </Typography>
                <FieldArray
                  name="tags"
                  render={() => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {values.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() =>
                            handleTagDelete(tag, values, setFieldValue)
                          }
                        />
                      ))}
                      <TextField
                        name="tagInput"
                        value={values.tagInput}
                        onChange={(e) =>
                          setFieldValue("tagInput", e.target.value)
                        }
                        onKeyDown={(e) =>
                          handleKeyDownInTagInput(e, values, setFieldValue)
                        }
                        placeholder="Add tags"
                        variant="outlined"
                        size="small"
                        error={touched.tagInput && Boolean(errors.tags)}
                        helperText={touched.tagInput ? errors.tags : null}
                        sx={{ width: "auto", flexGrow: 1 }}
                      />
                    </Box>
                  )}
                />
              </Box>
              <Button
                disabled={!(isValid && dirty)}
                type="submit"
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default QuestionForm;
