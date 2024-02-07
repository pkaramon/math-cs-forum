import { useCallback, useState } from "react";
import { Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [snackBarProps, setSnackBarProps] = useState({});

  const navigate = useNavigate();

  const showSnackbar = useCallback((msg, options = {}) => {
    setSnackBarProps({ open: true, message: msg, ...options });
  }, []);

  const showSnackbarThenRedirect = (
    msg,
    path,
    options = {},
    after = () => {},
  ) => {
    setSnackBarProps({ open: true, message: msg, ...options });
    setOpen(true);
    setTimeout(() => {
      setSnackBarProps((props) => ({ ...props, open: false }));
      navigate(path);
      after();
    }, 1500);
  };

  const SnackbarComponent = () => (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      {...snackBarProps}
    />
  );

  return { showSnackbar, SnackbarComponent, showSnackbarThenRedirect };
};

export default useSnackbar;
