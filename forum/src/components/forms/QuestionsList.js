import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box, Chip, Divider, Grid } from "@mui/material";

const questions = [
  {
    id: 1,
    votes: 0,
    answers: 1,
    title: "skardziony lokalizacja",
    tags: ["laptop", "problem", "skardziony"],
    author: "SebastianM Nowicjusz",
    points: 120,
    views: 51,
    posted: "1 dzień temu",
  },
];

const QuestionList = () => {
  return (
    <List>
      {questions.map((question) => (
        <Paper key={question.id} elevation={2} sx={{ my: 2 }}>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {question.title}
                </Typography>
              }
              secondary={
                <>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Typography variant="caption" color="text.secondary">
                        {question.votes} głosów
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption" color="text.secondary">
                        {question.answers} odpowiedzi
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption" color="text.secondary">
                        {question.views} wizyt
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 1 }}>
                    {question.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </Box>
                </>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Paper>
      ))}
    </List>
  );
};

export default QuestionList;
