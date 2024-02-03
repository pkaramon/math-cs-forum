import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import React from "react";

const QuestionCard = ({ question }) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card sx={{ marginBottom: 2 }} elevation={4}>
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary">
          {formatDate(question.addedAt)}
        </Typography>

        <Link href={"/about"} sx={{ color: "secondary.main" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", marginTop: 1 }}
          >
            {question.title}
          </Typography>
        </Link>

        <Box sx={{ marginTop: 2 }}>
          <Stack direction="row" spacing={1}>
            {question.tags.map((tag, index) => (
              <Chip key={index} label={tag} size="small" />
            ))}
          </Stack>
        </Box>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ marginTop: 2 }}
        >
          <IconButton aria-label="likes" size="small">
            <ThumbUpAltOutlinedIcon fontSize="inherit" />
            <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
              {question.likes}
            </Typography>
          </IconButton>
          <IconButton aria-label="comments" size="small">
            <CommentOutlinedIcon fontSize="inherit" />
            <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
              {question.answers}
            </Typography>
          </IconButton>
          <IconButton aria-label="views" size="small">
            <VisibilityOutlinedIcon fontSize="inherit" />
            <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
              {question.views}
            </Typography>
          </IconButton>
          <Chip
            onClick={() => {
              navigate("/ask-question");
            }}
            avatar={
              <Avatar sx={{ marginLeft: "auto", width: 24, height: 24 }}>
                {question.author.firstName.charAt(0)}
              </Avatar>
            }
            label={`${question.author.firstName} ${question.author.lastName}`}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
export default QuestionCard;
