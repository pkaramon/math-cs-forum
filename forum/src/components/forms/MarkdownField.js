import InfoModal from "../InfoModal";
import RenderMarkdown from "../RenderMarkdown";
import React, { useState } from "react";
import { Alert } from "@mui/material";
import MarkdownEditor from "../MarkdownEditor";
import { useField } from "formik";

const MarkdownField = ({ fieldName }) => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [field, meta, helpers] = useField(fieldName);

  return (
    <>
      <InfoModal
        title={"Preview"}
        open={previewModalOpen}
        setOpen={setPreviewModalOpen}
      >
        <RenderMarkdown content={previewContent} />
      </InfoModal>

      {meta.touched && meta.error && (
        <Alert severity={"error"}>{meta.error}</Alert>
      )}
      <MarkdownEditor
        value={field.value}
        setValue={(v) => {
          helpers.setTouched(true).then(() => {});
          helpers.setValue(v).then(() => {});
        }}
        onClickedPreview={(content) => {
          setPreviewContent(content);
          setPreviewModalOpen((open) => !open);
        }}
      />
    </>
  );
};
export default MarkdownField;
