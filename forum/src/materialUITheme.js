import { createTheme } from "@mui/material/styles";
import { LinkBehavior } from "./routing/router";

export const appBarHeight = {
  xs: "56px",
  sm: "64px",
  md: "64px",
  lg: "64px",
};

const theme = createTheme({
  shape: {
    borderRadius: 8,
  },
  palette: {
    primary: {
      main: "#242428",
    },
    secondary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },

    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
        underline: "hover",
      },
      styleOverrides: {
        root: {
          color: "#1976d2",
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: appBarHeight.lg,
        },
      },
    },
  },
});

export default theme;
