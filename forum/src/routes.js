const routes = {
  home: "/",
  about: "/about",
  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  askQuestion: "/ask-question",
  searchQuestion: "/search",
  question: "/question/:id",
  publicUserProfile: "/profile/:userId",
  profile: "/profile",
  editUserDetails: "/edit-user-details",
  notFound: "*",
  modifyQuestion: "/modify-question/:questionId",
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

export default routes;
