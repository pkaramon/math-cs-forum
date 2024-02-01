import "./App.css";
import { Typography } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import RegistrationForm from "./components/forms/RegistrationForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Layout />}>
          <Route
            path={"/"}
            element={<Typography variant={"body1"}>Home</Typography>}
          />
          <Route
            path={"/about"}
            element={<Typography variant={"body1"}>About</Typography>}
          />
          <Route
            path={"/login"}
            element={<Typography variant={"body1"}>Login</Typography>}
          />
          <Route path={"/register"} element={<RegistrationForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
