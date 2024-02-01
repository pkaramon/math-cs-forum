import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import React from "react";

function Layout() {
  return (
    <>
      <Navbar />
      <Box component="main" p={3}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;
