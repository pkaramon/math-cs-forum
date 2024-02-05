import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuestionService } from "../context/QuestionServiceContext";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { CommentOutlined, ThumbDown, ThumbUp } from "@mui/icons-material";
import LoadingIndicator from "../components/LoadingIndicator";
import NothingFound from "../components/NothingFound";
import RenderMarkdown from "../components/RenderMarkdown";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AnswersList from "../components/AnswersList";
import { createPublicProfileRoute, createQuestionRoute } from "../routes";
import { useAuth } from "../auth/AuthContext";
import AnswerForm from "../components/forms/AnswerForm";
import useSnackbar from "../hooks/useSnackbar";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token, userId } = useAuth();
  const questionService = useQuestionService();
  const { id: idStr } = useParams();
  const id = Number.parseInt(idStr, 10);
  const { SnackbarComponent, showSnackbarThenRedirect } = useSnackbar();

  const [questionData, setQuestionData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    questionService.getQuestionById(id).then((question) => {
      if (!question) {
        setQuestionData(null);
      } else {
        setQuestionData(question);
      }

      setIsLoading(false);
    });
  }, [id, questionService]);

  if (isLoading) {
    return <LoadingIndicator isLoading={true} />;
  }
  if (questionData === null) {
    return <NothingFound message={"Question not found."} />;
  }

  const addedAt = questionData.addedAt.toLocaleString();
  const modifiedAt = questionData.modifiedAt.toLocaleString();

  const handleAddingAnswer = (values) => {
    questionService
      .addAnswer(token, questionData.id, userId, {
        answer: values.answer,
      })
      .then(() => {
        showSnackbarThenRedirect(
          "Answer added successfully.",
          createQuestionRoute(questionData.id),
        );
      });
  };

  return (
    <Box sx={{ margin: "auto", maxWidth: "800px", p: 2 }}>
      <SnackbarComponent />
      <Card raised sx={{ mb: 5 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {questionData.title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ marginY: 1 }}>
            {questionData.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" />
            ))}
          </Stack>
          <Divider />

          <RenderMarkdown content={questionData.question} />
          <Divider />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Asked by {questionData.author.firstName}{" "}
            {questionData.author.lastName} on {addedAt}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            Modified on {modifiedAt}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginTop: 2 }}
          >
            <IconButton aria-label="likes" size="small">
              <VisibilityOutlinedIcon fontSize="inherit" />
              <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
                {questionData.views}
              </Typography>
            </IconButton>

            <IconButton aria-label="likes" size="small">
              <CommentOutlined fontSize="inherit" />
              <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
                {questionData.numberOfAnswers}
              </Typography>
            </IconButton>

            <Chip
              onClick={() =>
                navigate(createPublicProfileRoute(questionData.author.authorId))
              }
              avatar={
                <Avatar sx={{ marginLeft: "auto", width: 24, height: 24 }}>
                  {questionData.author.firstName.charAt(0)}
                </Avatar>
              }
              label={`${questionData.author.firstName} ${questionData.author.lastName}`}
            />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
            <IconButton aria-label="like question">
              <ThumbUp />
              <Typography sx={{ marginLeft: 1 }}>
                {questionData.likes}
              </Typography>
            </IconButton>
            <IconButton aria-label="dislike question">
              <ThumbDown />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
      <AnswersList answers={questionData.answers} />

      <Divider sx={{ my: 2 }} />
      {isAuthenticated ? (
        <AnswerForm onSubmit={handleAddingAnswer} />
      ) : (
        <Typography paragraph>
          You need to login in order to post an answer.
        </Typography>
      )}
    </Box>
  );
};

export default QuestionPage;
