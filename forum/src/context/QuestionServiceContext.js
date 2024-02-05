import { createContext, useContext } from "react";
import FakeQuestionService from "../services/FakeQuestionService";
import ServerQuestionService from "../services/ServerQuestionService";

export const QuestionServiceContext = createContext({});
export const useQuestionService = () => useContext(QuestionServiceContext);

export const QuestionServiceProvider = ({ children }) => {
  const questionService = new FakeQuestionService();
  const serverQuestionService = new ServerQuestionService();
  return (
    <QuestionServiceContext.Provider value={serverQuestionService}>
      {children}
    </QuestionServiceContext.Provider>
  );
};
