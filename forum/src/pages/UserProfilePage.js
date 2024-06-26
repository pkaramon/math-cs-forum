import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useUserService } from "../context/UserServiceContext";
import {
  Avatar,
  Button,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import LoadingIndicator from "../components/LoadingIndicator";
import routes, { createPublicProfileRoute } from "../routing/routes";
import { useQuestionService } from "../context/QuestionServiceContext";
import QuestionsList from "../components/QuestionsList/QuestionsList";
import ProfileAnswersList from "../components/ProfileAnswersList";
import PageCard from "../components/PageCard";
import useSnackbar from "../hooks/useSnackbar";

export const UserProfilePage = () => {
  const { userId, role, token, clearAuthData } = useAuth();
  const userService = useUserService();

  const questionsService = useQuestionService();
  const [userDetails, setUserDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const { showSnackbarThenRedirect } = useSnackbar();

  const logout = () => {
    showSnackbarThenRedirect(
      "You have been logged out successfully.",
      routes.home,
      {},
      clearAuthData,
    );
  };

  useEffect(() => {
    if (userId) {
      userService.getUserDetails(token).then((user) => {
        setUserDetails(user);
      });
      questionsService.search({ userId: userId }).then((questions) => {
        setQuestions(questions);
      });
      questionsService.searchAnswers({ userId }).then((answers) => {
        setAnswers(answers);
      });
    }
  }, [userId, userService, token, questionsService]);

  if (!userDetails) {
    return <LoadingIndicator isLoading={true} />;
  }

  return (
    <PageCard>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ bgcolor: deepOrange[500], width: 56, height: 56 }}>
              {userDetails.firstName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5">
              {userDetails.firstName} {userDetails.lastName}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {userDetails.email}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button variant="outlined" href={createPublicProfileRoute(userId)}>
              Public Profile
            </Button>
          </Grid>

          <Grid item>
            <Button variant="contained" onClick={() => logout()}>
              Logout
            </Button>
          </Grid>

          <Grid item>
            <Button variant="contained" href={routes.editUserDetails}>
              Edit
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem>
            <ListItemText primary="Role" secondary={role} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Birth Date"
              secondary={userDetails.birthDate.toDateString()}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="About"
              secondary={userDetails.about || "N/A"}
            />
          </ListItem>
        </List>
      </CardContent>

      <Divider sx={{ my: 2 }} />

      <CardContent sx={{ p: 0, m: 0 }}>
        <Typography variant={"h5"} sx={{ my: 2 }}>
          Questions
        </Typography>
        {questions.length === 0 ? (
          <Typography variant={"body1"}>No questions found</Typography>
        ) : (
          <QuestionsList questions={questions} />
        )}
      </CardContent>

      <Divider sx={{ my: 2 }} />
      <CardContent sx={{ p: 0, m: 0 }}>
        <Typography variant={"h5"} sx={{ my: 2 }}>
          Answers
        </Typography>
        {answers.length === 0 ? (
          <Typography variant={"body1"}>No answers found</Typography>
        ) : (
          <ProfileAnswersList answersData={answers} />
        )}
      </CardContent>
    </PageCard>
  );
};

export default UserProfilePage;
