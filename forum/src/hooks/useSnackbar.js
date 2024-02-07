import { createContext, useCallback, useContext, useState } from "react";
import { Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SnackbarContext = createContext({});

export const SnackbarProvider = ({ children }) => {
  const [snackBarProps, setSnackBarProps] = useState({});
  const navigate = useNavigate();

  const showSnackbar = useCallback((msg, options = {}) => {
    setSnackBarProps({ open: true, message: msg, ...options });
    setTimeout(() => {
      setSnackBarProps((props) => ({ ...props, open: false }));
    }, 1500);
  }, []);

  const showSnackbarThenRedirect = (
    msg,
    path,
    options = {},
    after = () => {},
  ) => {
    setSnackBarProps({ open: true, message: msg, ...options });
    setTimeout(() => {
      setSnackBarProps((props) => ({ ...props, open: false }));
      navigate(path);
      after();
    }, 1500);
  };

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar,
        showSnackbarThenRedirect,
      }}
    >
      {children}
      <Snackbar autoHideDuration={1000} {...snackBarProps} />
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export default useSnackbar;
