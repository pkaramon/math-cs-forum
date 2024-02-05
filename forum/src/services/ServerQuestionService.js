import axios from "axios";
import FakeQuestionService from "./FakeQuestionService";
import { fromAnswersResponseData, fromQuestionResponseData } from "./util";

class ServerQuestionService extends FakeQuestionService {
  constructor() {
    super();
    this.url = "http://localhost:5000/";
    this.http = axios.create({
      baseURL: this.url,
    });
  }

  async addQuestion(token, questionData) {
    const data = {
      title: questionData.title,
      question: questionData.question,
      tags: questionData.tags.join(","),
    };

    try {
      const response = await this.http.post("/add_question", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data["question_id"];
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.message);
    }
  }

  async getQuestionById(questionId) {
    try {
      const response = await this.http.get(`/get_question/${questionId}`);
      const data = response.data;
      return fromQuestionResponseData(data);
    } catch (err) {
      if (err?.response?.status === 404) {
        return null;
      }
      throw new Error(err.response.data.message);
    }
  }

  async addAnswer(token, answerData) {
    const data = {
      questionId: answerData.questionId,
      answer: answerData.answer,
    };

    try {
      await this.http.post(`/questions/${data.questionId}/add_answer`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }

  async search({
    query = "",
    tags = [],
    sortBy = "addedAt",
    sortOrder = "asc",
    skip = 0,
    limit = 10000000,
    userId,
  }) {
    switch (sortBy) {
      case "addedAt":
        sortBy = "added_at";
        break;
      case "modifiedAt":
        sortBy = "modified_at";
        break;
      case "answers":
        sortBy = "answers";
        break;
      case "views":
        sortBy = "views";
        break;
      case "likes":
        sortBy = "likes";
        break;
      default:
        sortBy = "added_at";
    }

    try {
      const response = await this.http.get("/search_questions", {
        params: {
          query,
          tags: tags.join(","),
          sort_by: sortBy,
          sort_order: sortOrder,
          skip,
          limit,
          user_id: userId,
        },
      });
      return response.data.map((questionData) =>
        fromQuestionResponseData(questionData),
      );
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.message);
    }
  }

  async searchAnswers({ userId }) {
    try {
      const response = await this.http.get("/search_answers", {
        params: { user_id: userId },
      });

      return response.data.map((answerData) =>
        fromAnswersResponseData(answerData),
      );
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.message);
    }
  }
}

export default ServerQuestionService;
