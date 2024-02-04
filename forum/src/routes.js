const routes = {
  home: "/",
  about: "/about",
  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  askQuestion: "/ask-question",
  searchQuestion: "/search",
  question: "/question/:id",
};

export const createSearchQuestionRoute = (query) => {
  return `${routes.searchQuestion}?search=${query}`;
};

export const createQuestionRoute = (id) => {
  return routes.question.replace(":id", id);
};

export default routes;
