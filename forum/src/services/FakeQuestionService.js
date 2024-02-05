import questionsJson from "../questions.json";
import { users } from "./FakeUserService";

export let questions = questionsJson.map((question) => ({
  ...question,
  addedAt: new Date(question.addedAt),
  modifiedAt: new Date(question.modifiedAt),
  authorId: question.author.authorId,
  answers: question.answers.map((answer) => ({
    ...answer,
    addedAt: new Date(answer.addedAt),
  })),
}));

export let questionLikes = [];
export let questionDislikes = [];
export let answerLikes = [];
export let answerDislikes = [];

class FakeQuestionService {
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

  async searchAnswers({ userId }) {
    await this.wait(200);
    return questions
      .map((question) =>
        question.answers
          .map((a) => ({ ...a, questionTitle: question.title }))
          .filter((answer) => answer.author.authorId === userId),
      )
      .flat();
  }

  async search({
    query,
    tags,
    sortBy = "addedAt",
    sortOrder = "asc",
    skip = 0,
    limit = 10000000,
    userId,
  }) {
    await this.wait(200);
    let filteredQuestions = questions;
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

    if (tags && tags.length > 0) {
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

    if (userId) {
      filteredQuestions = filteredQuestions.filter(
        (question) => question.author.authorId === userId,
      );
    }

    sortBy = sortBy || "addedAt";
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

  async getQuestionById(id) {
    await this.wait(200);
    const questionData = questions.find((question) => question.id === id);
    return {
      ...questionData,
    };
  }

  async addQuestion(token, userId, questionData) {
    await this.wait(200);
    const userData = users.find((user) => user.userId === userId);

    const newQuestion = {
      id: 100 * questions.length + 1,
      title: questionData.title,
      question: questionData.question,
      addedAt: new Date(),
      modifiedAt: new Date(),
      tags: questionData.tags,
      authorId: userId,
      author: {
        authorId: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
      views: 0,
      numberOfAnswers: 0,
      answers: [],
    };
    questions.push(newQuestion);
    return newQuestion;
  }

  async addAnswer(token, questionId, userId, answerData) {
    await this.wait(200);
    const question = questions.find((q) => q.id === questionId);
    const userData = users.find((user) => user.userId === userId);
    const newAnswer = {
      answerId: 100 * question.answers.length + 1,
      answer: answerData.answer,
      addedAt: new Date(),
      modifiedAt: new Date(),
      likes: 0,
      dislikes: 0,
      author: {
        authorId: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    };
    question.answers.push(newAnswer);
  }

  async wait(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }

  async findAllQuestionsForUser(userId) {
    await this.wait(200);
    return questions.filter((question) => question.author.id === userId);
  }

  async findAllAnswersForUser(userId) {
    await this.wait(200);
    return questions
      .map((question) =>
        question.answers.filter((answer) => answer.author.id === userId),
      )
      .flat();
  }

  async likeQuestion(token, userId, questionId) {
    await this.wait(200);
    const like = questionLikes.find(
      (like) => like.userId === userId && like.questionId === questionId,
    );

    if (like) {
      questionLikes = questionLikes.filter(
        (like) => like.userId !== userId || like.questionId !== questionId,
      );
      questions.filter((question) => question.id === questionId)[0].likes--;
      return -1;
    }
    questionLikes.push({ userId, questionId });

    questions.filter((question) => question.id === questionId)[0].likes++;
    return 1;
  }

  async dislikeQuestion(token, userId, questionId) {
    await this.wait(200);
    const dislike = questionDislikes.find(
      (dislike) =>
        dislike.userId === userId && dislike.questionId === questionId,
    );

    if (dislike) {
      questionDislikes = questionDislikes.filter(
        (dislike) =>
          dislike.userId !== userId || dislike.questionId !== questionId,
      );
      questions.filter((question) => question.id === questionId)[0].dislikes--;
      return -1;
    }
    questionDislikes.push({ userId, questionId });

    questions.filter((question) => question.id === questionId)[0].dislikes++;
    return 1;
  }

  async likeAnswer(token, userId, answerId) {
    await this.wait(200);
    const like = answerLikes.find(
      (like) => like.userId === userId && like.answerId === answerId,
    );

    const answer = questions
      .map((question) => question.answers)
      .flat()
      .filter((answer) => answer.answerId === answerId)[0];

    if (like) {
      answerLikes = answerLikes.filter(
        (like) => like.userId !== userId || like.answerId !== answerId,
      );
      answer.likes--;
      return answer;
    }
    answerLikes.push({ userId, answerId });

    answer.likes++;
    return answer;
  }

  async dislikeAnswer(token, userId, answerId) {
    await this.wait(200);
    const dislike = answerDislikes.find(
      (dislike) => dislike.userId === userId && dislike.answerId === answerId,
    );

    const answer = questions
      .map((question) => question.answers)
      .flat()
      .filter((answer) => answer.answerId === answerId)[0];

    if (dislike) {
      answerDislikes = answerDislikes.filter(
        (dislike) => dislike.userId !== userId || dislike.answerId !== answerId,
      );
      answer.dislikes--;
      return answer;
    }
    answerDislikes.push({ userId, answerId });

    answer.dislikes++;
    return answer;
  }

  async deleteQuestion(token, userId, questionId) {
    await this.wait(200);
    questions = questions.filter((question) => question.id !== questionId);
  }

  async deleteAnswer(token, userId, answerId) {
    await this.wait(200);
    questions = questions.map((question) => ({
      ...question,
      answers: question.answers.filter(
        (answer) => answer.answerId !== answerId,
      ),
      numberOfAnswers: question.answers.filter(
        (answer) => answer.answerId !== answerId,
      ).length,
    }));
  }
}

export default FakeQuestionService;
