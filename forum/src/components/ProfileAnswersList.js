import { Link, List, ListItem, ListItemText } from "@mui/material";
import { createQuestionRoute } from "../routes";
import React from "react";

function ProfileAnswersList({ answersData }) {
  return (
    <List>
      {answersData.map((answer) => (
        <ListItem key={answer.answerId} divider>
          <ListItemText
            primary={
              <>
                Answer to{" "}
                <Link href={createQuestionRoute(answer.questionId)}>
                  {answer.questionTitle}
                </Link>
              </>
            }
            secondary={`Likes: ${answer.likes}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
export default ProfileAnswersList;
