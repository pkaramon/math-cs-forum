import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserService } from "../context/UserServiceContext";
import routes, { createQuestionRoute } from "../routes";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import LoadingIndicator from "../components/LoadingIndicator";
import ProfileAnswersList from "../components/ProfileAnswersList";

const PublicProfilePage = () => {
  const { userId: userIdStr } = useParams();
  const navigate = useNavigate();
  const [userProfileData, setUserProfileData] = useState(null);
  const userId = parseInt(userIdStr, 10);
  const userService = useUserService();

  useEffect(() => {
    userService.findByIdForPublicProfile(userId).then((user) => {
      if (user === null) {
        navigate(routes.notFound);
      } else {
        setUserProfileData(user);
      }
    });
  }, [userId, navigate, userService]);

  if (!userProfileData) {
    return <LoadingIndicator isLoading={true} />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 5 }}>
      <Card elevation={12}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ mr: 2, bgcolor: "secondary.main" }}>
              {userProfileData.firstName.charAt(0)}
            </Avatar>
            <Typography variant="h5">
              {`${userProfileData.firstName} ${userProfileData.lastName}`}
            </Typography>
          </Box>

          <Typography paragraph>
            {`${userProfileData.totalQuestions} total questions, ${userProfileData.totalAnswers} total answers`}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          <Typography paragraph>{userProfileData.about}</Typography>

          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Newest Questions
          </Typography>
          {userProfileData.newestQuestions.length > 0 ? (
            <List>
              {userProfileData.newestQuestions.map((question) => (
                <ListItem key={question.id} divider>
                  <ListItemText
                    primary={
                      <Link href={createQuestionRoute(question.id)}>
                        {question.title}
                      </Link>
                    }
                    secondary={`Views: ${question.views}, Answers: ${question.numberOfAnswers}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary">No recent questions.</Typography>
          )}

          <Typography variant="h6" gutterBottom>
            Newest Answers
          </Typography>
          {userProfileData.newestAnswers.length > 0 ? (
            <ProfileAnswersList answersData={userProfileData.newestAnswers} />
          ) : (
            <Typography color="textSecondary">No recent answers.</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PublicProfilePage;
