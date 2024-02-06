import QuestionForm from "../components/forms/QuestionForm";
import { useAuth } from "../auth/AuthContext";
import { useQuestionService } from "../context/QuestionServiceContext";
import useSnackbar from "../hooks/useSnackbar";
import { createQuestionRoute } from "../routes";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const ModifyQuestionPage = () => {
  const { questionId } = useParams();
  const { token } = useAuth();
  const questionService = useQuestionService();
  const { showSnackbar, showSnackbarThenRedirect, SnackbarComponent } =
    useSnackbar();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    questionService
      .getQuestionById(questionId)
      .then((question) => {
        setInitialValues({
          title: question.title,
          question: question.question,
          tags: question.tags,
          tagInput: "",
        });
      })
      .catch((err) => {
        showSnackbar("Could not fetch question data");
      });
  }, []);

  const onSubmit = (values) => {
    questionService.modifyQuestion(token, questionId, values).then(() => {
      showSnackbarThenRedirect(
        "Successfully modified question",
        createQuestionRoute(questionId),
      );
    });
  };

  return (
    <>
      <SnackbarComponent />
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
