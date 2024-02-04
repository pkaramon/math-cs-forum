import questionsJson from "../questions.json";

class FakeQuestionService {
  constructor() {
    this.questions = questionsJson.map((question) => ({
      ...question,
      addedAt: new Date(question.addedAt),
      modifiedAt: new Date(question.modifiedAt),
    }));
  }
  async getNumberOfQuestionsMatching({ query, tags }) {
    await this.wait(100);
    const searched = await this.search({
      query,
      tags,
      sortBy: "addedAt",
      sortOrder: "asc",
      skip: 0,
      limit: 1000000,
    });
    return searched.length;
  }

  async search({ query, tags, sortBy, sortOrder, skip, limit }) {
    await this.wait(200);
    let filteredQuestions = this.questions;
    if (query) {
      const queryLowerCase = query.toLowerCase();
      filteredQuestions = filteredQuestions.filter((question) => {
        return (
          question.question.toLowerCase().includes(queryLowerCase) ||
          question.title.toLowerCase().includes(queryLowerCase) ||
          question.tags.some((tag) =>
            tag.toLowerCase().includes(queryLowerCase),
          ) ||
          question.author.firstName.toLowerCase().includes(queryLowerCase) ||
          question.author.lastName.toLowerCase().includes(queryLowerCase)
        );
      });
    }

    if (tags.length > 0) {
      filteredQuestions = filteredQuestions.filter((question) => {
        return tags
          .map((t) => t.toLowerCase())
          .every((tag) =>
            question.tags
              .map((t) => t.toLowerCase())
              .includes(tag.toLowerCase()),
          );
      });
    }

    filteredQuestions = filteredQuestions.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filteredQuestions.slice(skip, skip + limit);
  }

  async wait(miliSeconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, miliSeconds);
    });
  }
}

export default FakeQuestionService;
