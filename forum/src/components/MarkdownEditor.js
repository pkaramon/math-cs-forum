import React, { useMemo } from "react";
import SimpleMDE from "react-simplemde-editor";

const MarkdownEditor = ({ value, setValue, onClickedPreview }) => {
  const options = useMemo(
    () => ({
      spellChecker: true,
      autofocus: true,
      toolbar: [
        {
          name: "render",
          action: (editor) => {
            onClickedPreview(editor.value());
          },
          className: "fa fa-eye",
          title: "Preview",
        },
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "guide",
      ],
    }),
    [],
  );

  return (
    <SimpleMDE
      value={value}
      onChange={(v) => setValue(v)}
      style={{ zIndex: 1000, width: "100%" }}
      options={options}
    />
  );
};

export default MarkdownEditor;
