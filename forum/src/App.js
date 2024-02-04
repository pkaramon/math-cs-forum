import "./App.css";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import RegistrationForm from "./components/forms/RegistrationForm";
import LoginForm from "./components/forms/LoginForm";
import React from "react";
import theme from "./materialUITheme";
import ResetPassword from "./components/forms/ResetPassword";
import routes from "./routes";
import HomePage from "./pages/HomePage";
import AskQuestionForm from "./components/forms/AskQuestionForm";
import SearchQuestionsPage from "./pages/SearchQuestionsPage";
import QuestionPage from "./pages/QuestionPage";
import { QuestionServiceProvider } from "./context/QuestionServiceContext";
import AboutPage from "./pages/AboutPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import { UserServiceProvider } from "./context/UserServiceContext";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QuestionServiceProvider>
        <UserServiceProvider>
          <BrowserRouter>
            <Routes>
              <Route path={routes.login} element={<LoginForm />} />
              <Route path={routes.register} element={<RegistrationForm />} />
              <Route path={routes.resetPassword} element={<ResetPassword />} />

              <Route path={"/"} element={<Layout />}>
                <Route path={"/"} element={<HomePage />} />
                <Route
                  path={routes.searchQuestion}
                  element={<SearchQuestionsPage />}
                />
                <Route path={routes.about} element={<AboutPage />} />
                <Route
                  path={routes.askQuestion}
                  element={<AskQuestionForm />}
                />
                <Route path={routes.question} element={<QuestionPage />} />
                <Route path={routes.profile} element={<PublicProfilePage />} />

                <Route path={routes.notFound} element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserServiceProvider>
      </QuestionServiceProvider>
    </ThemeProvider>
  );
}

export default App;
