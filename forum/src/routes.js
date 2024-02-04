const routes = {
  home: "/",
  about: "/about",
  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  askQuestion: "/ask-question",
  searchQuestion: "/search",
};

export const createSearchQuestionRoute = (query) => {
  return `${routes.searchQuestion}?search=${query}`;
};

export default routes;
