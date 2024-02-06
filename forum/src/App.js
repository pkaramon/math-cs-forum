import "./App.css";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import React from "react";
import theme from "./materialUITheme";
import ResetPassword from "./components/forms/ResetPassword";
import routes from "./routes";
import HomePage from "./pages/HomePage";
import SearchQuestionsPage from "./pages/SearchQuestionsPage";
import QuestionPage from "./pages/QuestionPage";
import { QuestionServiceProvider } from "./context/QuestionServiceContext";
import AboutPage from "./pages/AboutPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import { UserServiceProvider } from "./context/UserServiceContext";
import NotFoundPage from "./pages/NotFoundPage";
import RequireAuth from "./auth/RequireAuth";
import * as roles from "./auth/roles";
import UserProfilePage from "./pages/UserProfilePage";
import LoginPage from "./pages/LoginPage";
import { AuthContextProvider } from "./auth/AuthContext";
import EditUserDetailsPage from "./pages/EditUserDetailsPage";
import RegistrationPage from "./pages/RegistrationPage";
import AskQuestionPage from "./pages/AskQuestionPage";
import ModifyQuestionPage from "./pages/ModifyQuestionPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QuestionServiceProvider>
        <UserServiceProvider>
          <AuthContextProvider>
            <BrowserRouter>
              <Routes>
                <Route path={routes.login} element={<LoginPage />} />
                <Route path={routes.register} element={<RegistrationPage />} />
                <Route
                  path={routes.resetPassword}
                  element={<ResetPassword />}
                />

                <Route path={"/"} element={<Layout />}>
                  <Route path={"/"} element={<HomePage />} />
                  <Route
                    path={routes.searchQuestion}
                    element={<SearchQuestionsPage />}
                  />
                  <Route path={routes.about} element={<AboutPage />} />

                  <Route
                    path={"/"}
                    element={<RequireAuth roles={[roles.USER, roles.ADMIN]} />}
                  >
                    <Route
                      path={routes.askQuestion}
                      element={<AskQuestionPage />}
                    />
                    <Route
                      path={routes.profile}
                      element={<UserProfilePage />}
                    />
                    <Route
                      path={routes.editUserDetails}
                      element={<EditUserDetailsPage />}
                    />

                    <Route
                      path={routes.modifyQuestion}
                      element={<ModifyQuestionPage />}
                    />
                  </Route>

                  <Route path={routes.question} element={<QuestionPage />} />
                  <Route
                    path={routes.publicUserProfile}
                    element={<PublicProfilePage />}
                  />

                  <Route path={routes.notFound} element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthContextProvider>
        </UserServiceProvider>
      </QuestionServiceProvider>
    </ThemeProvider>
  );
}

export default App;
