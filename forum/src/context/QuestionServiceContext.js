import { createContext, useContext } from "react";
import FakeQuestionService from "../services/FakeQuestionService";

export const QuestionServiceContext = createContext({});
export const useQuestionService = () => useContext(QuestionServiceContext);

export const QuestionServiceProvider = ({ children }) => {
  const questionService = new FakeQuestionService();
  return (
    <QuestionServiceContext.Provider value={questionService}>
      {children}
    </QuestionServiceContext.Provider>
  );
};
