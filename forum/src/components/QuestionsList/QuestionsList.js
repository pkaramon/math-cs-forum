import React from "react";
import { Box } from "@mui/material";
import QuestionCard from "./QuestionCard";

const QuestionsList = ({ questions }) => {
  return (
    <Box sx={{ maxWidth: "md", m: { xs: 0, sm: "auto" } }}>
      {questions.map((question, index) => (
        <QuestionCard key={index} question={question} />
      ))}
    </Box>
  );
};

export default QuestionsList;
