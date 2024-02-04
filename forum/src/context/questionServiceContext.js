import { createContext, useContext } from "react";
import FakeQuestionService from "../services/FakeQuestionService";

export const questionServiceContext = createContext({});
export const useQuestionService = () => useContext(questionServiceContext);

export const QuestionServiceProvider = ({ children }) => {
  const questionService = new FakeQuestionService();
  return (
    <questionServiceContext.Provider value={questionService}>
      {children}
    </questionServiceContext.Provider>
  );
};
