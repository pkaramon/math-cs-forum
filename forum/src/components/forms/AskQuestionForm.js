import React, { useState } from "react";
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
import MarkdownEditor from "../MarkdownEditor";
import RenderMarkdown from "../RenderMarkdown";
import InfoModal from "../InfoModal";
import { markdownSample } from "../sampledata";

const initialValues = {
  title: "",
  question: markdownSample,
  tags: [],
  tagInput: "",
};

const AskQuestionForm = () => {
  const [previewContent, setPreviewContent] = useState("");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const onSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 400);
  };

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
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <InfoModal
        title={"Preview"}
        open={previewModalOpen}
        setOpen={setPreviewModalOpen}
      >
        <RenderMarkdown content={previewContent} />
      </InfoModal>
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ values, setFieldValue }) => (
            <Form>
              <Typography variant="h6" gutterBottom>
                Ask a Question
              </Typography>
              <FormField property={"title"} label={"Title"} />
              <Typography variant="body1">Question</Typography>
              <MarkdownEditor
                value={values.question}
                setValue={(v) => setFieldValue("question", v)}
                onClickedPreview={(content) => {
                  setPreviewContent(content);
                  setPreviewModalOpen((open) => !open);
                }}
              />
              <Box sx={{ my: 2 }}>
                <Typography variant="body1">Tags</Typography>
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
                        sx={{ width: "auto", flexGrow: 1 }}
                      />
                    </Box>
                  )}
                />
              </Box>
              <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default AskQuestionForm;
