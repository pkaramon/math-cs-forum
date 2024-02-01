import "./App.css";
import { ThemeProvider, Typography } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import RegistrationForm from "./components/forms/RegistrationForm";
import LoginForm from "./components/forms/LoginForm";
import React from "react";
import theme from "./materialUITheme";
import ResetPassword from "./components/forms/ResetPassword";
import routes from "./routes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Layout />}>
            <Route
              path={"/"}
              element={<Typography variant={"body1"}>Home</Typography>}
            />
            <Route
              path={routes.about}
              element={<Typography variant={"body1"}>About</Typography>}
            />
          </Route>
          <Route path={routes.login} element={<LoginForm />} />
          <Route path={routes.register} element={<RegistrationForm />} />
          <Route path={routes.resetPassword} element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
