import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useUserService } from "../context/UserServiceContext";
import {
  Avatar,
  Button,
  Card,
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
import routes, { createPublicProfileRoute } from "../routes";
import { useQuestionService } from "../context/QuestionServiceContext";
import QuestionsList from "../components/QuestionsList/QuestionsList";
import ProfileAnswersList from "../components/ProfileAnswersList";
import { useNavigate } from "react-router-dom";

export const UserProfilePage = () => {
  const { userId, role, token, clearAuthData } = useAuth();
  const userService = useUserService();
  const navigate = useNavigate();

  const questionsService = useQuestionService();
  const [userDetails, setUserDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const logout = () => {
    clearAuthData();
    navigate(routes.home);
  };

  useEffect(() => {
    if (userId) {
      userService.getUserDetails(token).then((user) => {
        setUserDetails(user);
      });
      questionsService.search({ userId: userId }).then((questions) => {
        console.log(questions);
        setQuestions(questions);
      });
      questionsService.searchAnswers({ userId }).then((answers) => {
        console.log(answers);
        setAnswers(answers);
      });
    }
  }, [userId, userService, token, questionsService]);

  if (!userDetails) {
    return <LoadingIndicator isLoading={true} />;
  }

  return (
    <Card sx={{ maxWidth: "md", mx: "auto", mt: 10, mb: 2 }} elevation={12}>
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
            <ListItemText primary="User ID" secondary={userId} />
          </ListItem>
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
      <CardContent>
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
      <CardContent>
        <Typography variant={"h5"} sx={{ my: 2 }}>
          Answers
        </Typography>
        {answers.length === 0 ? (
          <Typography variant={"body1"}>No answers found</Typography>
        ) : (
          <ProfileAnswersList answersData={answers} />
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfilePage;
