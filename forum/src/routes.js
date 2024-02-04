const routes = {
  home: "/",
  about: "/about",
  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  askQuestion: "/ask-question",
  searchQuestion: "/search",
  question: "/question/:id",
  profile: "/profile/:userId",
  notFound: "*",
};

export const createSearchQuestionRoute = (query) => {
  return `${routes.searchQuestion}?search=${query}`;
};

export const createQuestionRoute = (id) => {
  return routes.question.replace(":id", id);
};

export const createProfileRoute = (userId) => {
  return routes.profile.replace(":userId", userId);
};

export default routes;
