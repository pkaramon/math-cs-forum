import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import React from "react";

function Layout() {
  const mainBoxStyles = {
    width: "100%",
    marginTop: { md: 8, sm: 3, xs: 4 }, // Default AppBar height for Material UI
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
