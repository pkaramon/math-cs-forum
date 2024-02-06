import AskQuestionForm from "../components/forms/AskQuestionForm";
import { useAuth } from "../auth/AuthContext";
import { useQuestionService } from "../context/QuestionServiceContext";
import useSnackbar from "../hooks/useSnackbar";
import { createQuestionRoute } from "../routes";

export const AskQuestionPage = () => {
  const { token } = useAuth();
  const questionService = useQuestionService();
  const { showSnackbarThenRedirect, SnackbarComponent } = useSnackbar();

  const onSubmit = (values) => {
    questionService.addQuestion(token, values).then((questionId) => {
      showSnackbarThenRedirect(
        "Successfully created question",
        createQuestionRoute(questionId),
      );
    });
  };
  return (
    <>
      <SnackbarComponent />
      <AskQuestionForm onSubmit={onSubmit} />
    </>
  );
};

export default AskQuestionPage;
