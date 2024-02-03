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
import Jumbotron from "./components/Jumbotron";
import AskQuestionForm from "./components/forms/AskQuestionForm";
import SearchQuestionForm from "./components/forms/SearchQuestionForm";

const tagsOptions = [
  { value: "c", label: "c" },
  { value: "cpp", label: "cpp" },
  { value: "java", label: "java" },
  { value: "python", label: "python" },
  // Add more tags here as needed
];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Layout />}>
            <Route path={"/"} element={<Jumbotron />} />
            <Route
              path={routes.searchQuestion}
              element={
                <SearchQuestionForm
                  popularTags={tagsOptions}
                  onSearch={() => {}}
                />
              }
            />
            <Route
              path={routes.about}
              element={<Typography variant={"body1"}>About</Typography>}
            />
            <Route path={routes.askQuestion} element={<AskQuestionForm />} />
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
