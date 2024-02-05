import React from "react";
import { Box } from "@mui/material";
import QuestionCard from "./QuestionCard";

const QuestionsList = ({ questions }) => {
  return (
    <Box sx={{ maxWidth: "800px", margin: "auto" }}>
      {questions.map((question, index) => (
        <QuestionCard key={index} question={question} />
      ))}
    </Box>
  );
};

export default QuestionsList;
