import React, { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import katex from "katex";

const RenderMarkdown = ({ content }) => {
  const [renderedContent, setRenderedContent] = useState("");

  useEffect(() => {
    if (content) {
      const html = marked(content);
      const sanitizedHtml = DOMPurify.sanitize(html);
      setRenderedContent(sanitizedHtml);
    }
  }, [content]);

  const renderLatex = (text) => {
    let renderedText = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, p1) => {
      try {
        return katex.renderToString(p1, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (e) {
        return match;
      }
    });

    renderedText = renderedText.replace(/\$([^$]+?)\$/g, (match, p1) => {
      try {
        return katex.renderToString(p1, {
          throwOnError: false,
          displayMode: false,
        });
      } catch (e) {
        return match;
      }
    });

    return renderedText;
  };

  return (
    <div dangerouslySetInnerHTML={{ __html: renderLatex(renderedContent) }} />
  );
};

export default RenderMarkdown;
