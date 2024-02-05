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
import routes, {
  createPublicProfileRoute,
  createQuestionRoute,
} from "../routes";
import { useAuth } from "../auth/AuthContext";
import AnswerForm from "../components/forms/AnswerForm";
import useSnackbar from "../hooks/useSnackbar";
import DeleteButton from "../components/DeleteButton";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token, userId, isAdmin } = useAuth();
  const questionService = useQuestionService();
  const { id: idStr } = useParams();
  const id = Number.parseInt(idStr, 10);
  const { SnackbarComponent, showSnackbar, showSnackbarThenRedirect } =
    useSnackbar();

  const [questionData, setQuestionData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const likeQuestion = () => {
    if (!isAuthenticated) {
      showSnackbar("You need to login in order to like a question.");
      return;
    }
    questionService.likeQuestion(token, userId, id).then((change) => {
      setQuestionData((prev) => ({
        ...prev,
        likes: prev.likes + change,
      }));
    });
  };

  const dislikeQuestion = () => {
    if (!isAuthenticated) {
      showSnackbar("You need to login in order to dislike a question.");
      return;
    }
    questionService.dislikeQuestion(token, userId, id).then((change) => {
      setQuestionData((prev) => ({
        ...prev,
        dislikes: prev.dislikes + change,
      }));
    });
  };

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

  const deleteQuestion = () => {
    questionService.deleteQuestion(token, userId, questionData.id).then(() => {
      showSnackbarThenRedirect("Question deleted.", routes.searchQuestion);
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
          <Divider sx={{ my: 2 }} />

          <RenderMarkdown content={questionData.question} />
          <Divider sx={{ my: 2 }} />
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
            <IconButton aria-label="views" size="small">
              <VisibilityOutlinedIcon fontSize="inherit" />
              <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
                {questionData.views}
              </Typography>
            </IconButton>

            <IconButton aria-label="number of answers" size="small">
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
            <IconButton
              aria-label="like question"
              onClick={() => likeQuestion()}
            >
              <ThumbUp />
              <Typography sx={{ marginLeft: 1 }}>
                {questionData.likes}
              </Typography>
            </IconButton>
            <IconButton
              aria-label="dislike question"
              onClick={() => dislikeQuestion()}
            >
              <ThumbDown />
              <Typography sx={{ marginLeft: 1 }}>
                {questionData.dislikes}
              </Typography>
            </IconButton>
          </Stack>
          {isAdmin && (
            <>
              <Divider sx={{ my: 2 }} />
              <DeleteButton onClick={deleteQuestion}>
                Delete Question
              </DeleteButton>
            </>
          )}
        </CardContent>
      </Card>
      <AnswersList answers={questionData.answers} />
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
