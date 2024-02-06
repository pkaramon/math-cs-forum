import { createContext, useContext } from "react";
import ServerQuestionService from "../services/ServerQuestionService";

export const QuestionServiceContext = createContext({});
export const useQuestionService = () => useContext(QuestionServiceContext);

export const QuestionServiceProvider = ({ children }) => {
  const serverQuestionService = new ServerQuestionService();
  return (
    <QuestionServiceContext.Provider value={serverQuestionService}>
      {children}
    </QuestionServiceContext.Provider>
  );
};
