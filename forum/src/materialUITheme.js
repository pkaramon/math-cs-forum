import { createTheme } from "@mui/material/styles";
import { LinkBehavior } from "./router";

const theme = createTheme({
  shape: {
    borderRadius: 8, // Adjust for more or less rounded corners
  },
  palette: {
    primary: {
      main: "#5E35B1", // A deep purple
    },
    secondary: {
      main: "#FF4081", // A vibrant pink
    },
    background: {
      default: "#f5f5f5", // A light gray background
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
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

export default theme;
