import {
  Avatar,
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
import { ThumbDownAltOutlined } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { createProfileRoute } from "../routes";

const AnswerCard = ({ answer }) => {
  const navigate = useNavigate();
  return (
    <Card elevation={2} sx={{ mt: 2 }}>
      <CardContent>
        <RenderMarkdown content={answer.answer} />
        <Divider />

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ marginTop: 2 }}
        >
          <IconButton aria-label="likes" size="small">
            <CalendarIcon fontSize="inherit" />
            <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
              {answer.addedAt.toLocaleString()}
            </Typography>
          </IconButton>
          <Chip
            onClick={() => navigate(createProfileRoute(answer.author.authorId))}
            avatar={
              <Avatar sx={{ marginLeft: "auto", width: 24, height: 24 }}>
                {answer.author.firstName.charAt(0)}
              </Avatar>
            }
            label={`${answer.author.firstName} ${answer.author.lastName}`}
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <IconButton aria-label="like answer" onClick={() => {}}>
            <ThumbUpAltOutlinedIcon />
            <Typography sx={{ marginLeft: 1 }}>{answer.likes}</Typography>
          </IconButton>
          <IconButton aria-label="dislike answer" onClick={() => {}}>
            <ThumbDownAltOutlined />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AnswerCard;
