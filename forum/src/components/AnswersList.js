import React, { useState } from "react";
import AnswerCard from "./AnswerCard";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const sortOptions = [
  { value: "likes", label: "Highest rated" },
  { value: "modifiedAt", label: "Date modified(newest first)" },
  { value: "addedAt", label: "Date added(oldest first)" },
];

const AnswersList = ({ answers }) => {
  const [answersList, setAnswersList] = useState(answers);
  const [sortType, setSortType] = useState(sortOptions[0].value);

  const updateAnswerData = (answerId, newAnswerData) => {
    const index = answersList.findIndex(
      (answer) => answer.answerId === answerId,
    );
    answersList[index] = newAnswerData;
    setAnswersList([...answersList]);
  };

  answersList.sort((a, b) => {
    if (sortType === "likes") {
      return b.likes - a.likes;
    }
    if (sortType === "modifiedAt") {
      return b.modifiedAt - a.modifiedAt;
    }
    return a.addedAt - b.addedAt;
  });

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant={"h5"}>{answersList.length} Answers</Typography>
        <FormControl>
          <InputLabel>Sort By</InputLabel>
          <Select
            name={"sortBy"}
            label="Sort By"
            as={Select}
            value={sortType}
            onChange={(e) => {
              setSortType(e.target.value);
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {answersList.map((answer) => (
        <AnswerCard
          key={answer.answerId}
          answerData={answer}
          updateAnswerData={updateAnswerData}
        />
      ))}
    </Box>
  );
};
export default AnswersList;
