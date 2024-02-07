const routes = {
  home: "/",
  about: "/about",
  login: "/login",
  register: "/register",
  askQuestion: "/ask-question",
  searchQuestion: "/search",
  question: "/question/:id",
  publicUserProfile: "/profile/:userId",
  profile: "/profile",
  editUserDetails: "/edit-user-details",
  notFound: "*",
  modifyQuestion: "/modify-question/:questionId",
  modifyAnswer: "/modify-answer/:answerId",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password/:token",
};

export const createSearchQuestionRoute = (query) => {
  return `${routes.searchQuestion}?search=${query}`;
};

export const createQuestionRoute = (id) => {
  return routes.question.replace(":id", id);
};

export const createPublicProfileRoute = (userId) => {
  return routes.publicUserProfile.replace(":userId", userId);
};

export const createModifyQuestionRoute = (questionId) => {
  return routes.modifyQuestion.replace(":questionId", questionId);
};

export const createModifyAnswerRoute = (answerId) => {
  return routes.modifyAnswer.replace(":answerId", answerId);
};

export default routes;
