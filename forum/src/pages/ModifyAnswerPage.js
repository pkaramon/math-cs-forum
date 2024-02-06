import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { useQuestionService } from "../context/QuestionServiceContext";
import useSnackbar from "../hooks/useSnackbar";
import routes, { createQuestionRoute } from "../routing/routes";
import AnswerForm from "../components/forms/AnswerForm";
import PageCard from "../components/PageCard";

const ModifyAnswerPage = () => {
  const { answerId } = useParams();
  const { token, userId } = useAuth();
  const navigate = useNavigate();
  const questionService = useQuestionService();
  const { showSnackbarThenRedirect, showSnackbar, SnackbarComponent } =
    useSnackbar();

  const [answerData, setAnswerData] = useState(null);

  useEffect(() => {
    questionService
      .getAnswerById(answerId)
      .then((answer) => {
        if (answer.author.authorId !== userId) {
          navigate(routes.notFound);
          return;
        }
        setAnswerData(answer);
      })
      .catch(() => showSnackbar("Could not load answer"));
  }, []);

  const onSubmit = (values) => {
    questionService
      .modifyAnswer(token, answerId, values)
      .then(() =>
        showSnackbarThenRedirect(
          "Successfully modified answer",
          createQuestionRoute(answerData.questionId),
        ),
      )
      .catch((err) => showSnackbar(err.message));
  };

  return (
    <>
      <SnackbarComponent />
      <PageCard>
        {answerData !== null && (
          <AnswerForm
            initialValues={answerData}
            onSubmit={onSubmit}
            title="Modify answer"
          />
        )}
      </PageCard>
    </>
  );
};

export default ModifyAnswerPage;
