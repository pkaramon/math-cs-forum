import React from "react";
import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Using Search as magnifier

const NothingFound = ({ message = "No results found." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 2,
      }}
    >
      <SearchIcon sx={{ fontSize: 200 }} />
      <Typography variant="h6" textAlign={"center"}>
        {message}
      </Typography>
    </Box>
  );
};

export default NothingFound;
