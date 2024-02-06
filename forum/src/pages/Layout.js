import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import React from "react";
import { appBarHeight } from "../materialUITheme";

function Layout() {
  const mainBoxStyles = {
    width: "100%",
    marginTop: appBarHeight,
  };
  return (
    <>
      <Navbar />
      <Box component="main" sx={mainBoxStyles}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;
