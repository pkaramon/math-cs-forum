import { Button } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import React from "react";

const DeleteButton = ({ children, onClick }) => {
  return (
    <Button
      variant={"contained"}
      color={"error"}
      onClick={onClick}
      startIcon={<DeleteIcon />}
    >
      {children}
    </Button>
  );
};

export default DeleteButton;
