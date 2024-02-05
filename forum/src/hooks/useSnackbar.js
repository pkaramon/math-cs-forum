import { useState } from "react";
import { Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const showSnackbar = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  const showSnackbarThenRedirect = (msg, path) => {
    setMessage(msg);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      navigate(path);
    }, 2000);
  };

  const SnackbarComponent = () => (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      message={message}
    />
  );

  return { showSnackbar, SnackbarComponent, showSnackbarThenRedirect };
};

export default useSnackbar;
