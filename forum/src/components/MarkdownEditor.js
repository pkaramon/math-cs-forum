import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";

const MarkdownEditor = ({ onContentChange, initial }) => {
  const [value, setValue] = useState(initial ?? "");

  const handleChange = (value) => {
    setValue(value);
    onContentChange(value);
  };

  return (
    <SimpleMDE
      value={value}
      onChange={handleChange}
      style={{ zIndex: 1000, maxWidth: "700px" }}
    />
  );
};

export default MarkdownEditor;
