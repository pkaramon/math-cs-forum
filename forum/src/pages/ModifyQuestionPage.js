import QuestionForm from "../components/forms/QuestionForm";
import { useAuth } from "../auth/AuthContext";
import { useQuestionService } from "../context/QuestionServiceContext";
import useSnackbar from "../hooks/useSnackbar";
import routes, { createQuestionRoute } from "../routing/routes";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const ModifyQuestionPage = () => {
  const { questionId } = useParams();
  const { token, userId } = useAuth();
  const questionService = useQuestionService();
  const { showSnackbar, showSnackbarThenRedirect } = useSnackbar();
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    questionService
      .getQuestionById(questionId)
      .then((question) => {
        if (question.author.authorId !== userId) {
          navigate(routes.notFound);
          return;
        }
        setInitialValues({
          title: question.title,
          question: question.question,
          tags: question.tags,
          tagInput: "",
        });
      })
      .catch(() => {
        showSnackbar("Could not fetch question data");
      });
  }, [navigate, questionId, questionService, showSnackbar, userId]);

  const onSubmit = (values) => {
    questionService
      .modifyQuestion(token, questionId, values)
      .then(() => {
        showSnackbarThenRedirect(
          "Successfully modified question",
          createQuestionRoute(questionId),
        );
      })
      .catch((err) => {
        showSnackbar(err.message);
      });
  };

  return (
    <>
      {initialValues !== null && (
        <QuestionForm
          onSubmit={onSubmit}
          title="Modify your question"
          initialValues={initialValues}
        />
      )}
    </>
  );
};

export default ModifyQuestionPage;
