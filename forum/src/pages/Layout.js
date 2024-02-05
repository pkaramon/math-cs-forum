import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import React from "react";
import { appBarHeight } from "../materialUITheme";
import ServerUserService from "../services/ServerUserService";

function Layout() {
  const mainBoxStyles = {
    width: "100%",
    marginTop: appBarHeight,
  };
  const userService = new ServerUserService();

  // useEffect(() => {
  //   userService.register({
  //     firstName: "John",
  //     lastName: "Doe",
  //     email: "johndoe@gmail.com",
  //     password: "password",
  //     birthDate: new Date("1990-01-01"),
  //   });
  // }, []);

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
