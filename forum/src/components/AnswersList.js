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
  const [sortType, setSortType] = useState(sortOptions[0].value);

  answers.sort((a, b) => {
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
        <Typography variant={"h5"}>{answers.length} Answers</Typography>
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

      {answers.map((answer) => (
        <AnswerCard key={answer.answerId} answerData={answer} />
      ))}
    </Box>
  );
};
export default AnswersList;
