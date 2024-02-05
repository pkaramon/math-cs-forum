import AskQuestionForm from "../components/forms/AskQuestionForm";
import { useAuth } from "../auth/AuthContext";
import { useQuestionService } from "../context/QuestionServiceContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createQuestionRoute } from "../routes";
import { Snackbar } from "@mui/material";

export const AskQuestionPage = () => {
  const { token, userId } = useAuth();
  const questionService = useQuestionService();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (values) => {
    questionService.addQuestion(token, userId, values).then((question) => {
      if (question) {
        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
          navigate(createQuestionRoute(question.id));
        }, 2000);
      }
    });
  };
  return (
    <>
      {openSnackbar && (
        <Snackbar
          message={"Question added successfully"}
          severity="success"
          open={openSnackbar}
          autoHideDuration={2000}
        />
      )}
      <AskQuestionForm onSubmit={onSubmit} />
    </>
  );
};

export default AskQuestionPage;
