import AskQuestionForm from "../components/forms/AskQuestionForm";
import { useAuth } from "../auth/AuthContext";
import { useQuestionService } from "../context/QuestionServiceContext";
import useSnackbar from "../hooks/useSnackbar";

export const AskQuestionPage = () => {
  const { token } = useAuth();
  const questionService = useQuestionService();
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const onSubmit = (values) => {
    questionService.addQuestion(token, values).then((questionId) => {
      // TODO change to showSnackbarThenRedirect
      showSnackbar("Successfully created question");
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
