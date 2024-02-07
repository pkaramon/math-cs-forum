import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import RenderMarkdown from "./RenderMarkdown";
import { CalendarIcon } from "@mui/x-date-pickers";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { Done, ThumbDownAltOutlined } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  createModifyAnswerRoute,
  createPublicProfileRoute,
} from "../routing/routes";
import { useQuestionService } from "../context/QuestionServiceContext";
import { useAuth } from "../auth/AuthContext";
import useSnackbar from "../hooks/useSnackbar";
import DeleteButton from "./DeleteButton";
import useConfirmDialog from "../hooks/useConfirmDialog";

const AnswerCard = ({ answerData, updateAnswerData }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, userId, token } = useAuth();
  const { openModal } = useConfirmDialog();
  const questionService = useQuestionService();
  const { showSnackbar, SnackbarComponent, showSnackbarThenRedirect } =
    useSnackbar();

  const updateAnswersList = (likes, dislikes) => {
    updateAnswerData(answerData.answerId, { ...answerData, likes, dislikes });
  };

  const likeAnswer = () => {
    if (!isAuthenticated) {
      showSnackbar("You need to login in order to like an answer.");
      return;
    }
    questionService
      .likeAnswer(token, answerData.answerId)
      .then(({ likes, dislikes }) => {
        updateAnswersList(likes, dislikes);
      });
  };

  const dislikeAnswer = () => {
    if (!isAuthenticated) {
      showSnackbar("You need to login in order to dislike an answer.");
      return;
    }
    questionService
      .dislikeAnswer(token, answerData.answerId)
      .then(({ likes, dislikes }) => {
        updateAnswersList(likes, dislikes);
      });
  };

  const canDeleteAnswer = isAdmin || userId === answerData.author.authorId;
  const canModifyAnswer = userId === answerData.author.authorId;

  const deleteAnswer = () => {
    openModal({
      title: "Delete answer",
      content: "Are you sure you want to delete this answer?",
      onAgree: () => {
        questionService
          .deleteAnswer(token, answerData.answerId)
          .then(() => {
            showSnackbarThenRedirect("Answer deleted.", 0);
          })
          .catch(() => {
            showSnackbar("Could not delete answer");
          });
      },
    });
  };

  const canVerifyAnswer = isAdmin;
  const verifyAnswer = () => {
    questionService
      .toggleAnswerVerification(token, answerData.answerId)
      .then(({ verified }) => {
        const msg = verified
          ? "Answer verified"
          : "Removed verification from the answer";
        showSnackbarThenRedirect(msg, 0);
      })
      .catch(() => {
        showSnackbar("Could not verify answer");
      });
  };

  return (
    <Card elevation={2} sx={{ mt: 2 }}>
      <SnackbarComponent />
      <CardContent>
        <RenderMarkdown content={answerData.answer} />
        <Divider />

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ marginTop: 2 }}
          flexWrap={"wrap"}
        >
          {answerData.verified && (
            <Chip
              avatar={<Done style={{ color: "white" }} />}
              label={`Verified`}
              color={"success"}
            />
          )}

          <IconButton aria-label="likes" size="small">
            <CalendarIcon fontSize="inherit" />
            <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
              {answerData.addedAt.toLocaleString()}
            </Typography>
          </IconButton>
          <Chip
            onClick={() =>
              navigate(createPublicProfileRoute(answerData.author.authorId))
            }
            avatar={
              <Avatar sx={{ marginLeft: "auto", width: 24, height: 24 }}>
                {answerData.author.firstName.charAt(0)}
              </Avatar>
            }
            label={`${answerData.author.firstName} ${answerData.author.lastName}`}
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <IconButton
            aria-label="like answer"
            onClick={() => {
              likeAnswer();
            }}
          >
            <ThumbUpAltOutlinedIcon />
            <Typography sx={{ marginLeft: 1 }}>{answerData.likes}</Typography>
          </IconButton>
          <IconButton
            aria-label="dislike answer"
            onClick={() => {
              dislikeAnswer();
            }}
          >
            <ThumbDownAltOutlined />
            <Typography sx={{ marginLeft: 1 }}>
              {answerData.dislikes}
            </Typography>
          </IconButton>
        </Stack>

        {(canDeleteAnswer || canModifyAnswer) && (
          <>
            <Divider sx={{ my: 2 }} />

            <Stack
              direction="row"
              spacing={1}
              sx={{ marginTop: 2, justifyContent: "flex-end" }}
            >
              {canDeleteAnswer && (
                <DeleteButton onClick={deleteAnswer}>Delete</DeleteButton>
              )}

              {canVerifyAnswer && (
                <Button variant={"outlined"} onClick={verifyAnswer}>
                  {answerData.verified ? "Remove verified" : "Verify"}
                </Button>
              )}

              {canModifyAnswer && (
                <Button
                  variant={"outlined"}
                  href={createModifyAnswerRoute(answerData.answerId)}
                >
                  Modify
                </Button>
              )}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AnswerCard;
