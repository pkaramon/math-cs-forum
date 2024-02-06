import axios from "axios";
import { fromAnswersResponseData, fromQuestionResponseData } from "./util";

class ServerQuestionService {
  constructor() {
    this.url = "http://localhost:5000/";
    this.http = axios.create({
      baseURL: this.url,
    });
  }

  async getNumberOfQuestionsMatching({ query, tags }) {
    try {
      const response = await this.http.get(
        "/get_number_of_questions_matching",
        {
          params: { query, tags: tags.join(",") },
        },
      );
      return response.data.count;
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.message);
    }
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

  async modifyQuestion(token, questionId, questionData) {
    const data = {
      title: questionData.title,
      question: questionData.question,
      tags: questionData.tags.join(","),
    };

    try {
      await this.http.put(`/modify_question/${questionId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.message);
    }
  }

  async modifyAnswer(token, answerId, answerData) {
    const data = {
      answer: answerData.answer,
    };
    try {
      await this.http.put(`/modify_answer/${answerId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.message);
    }
  }

  async viewQuestion(token, questionId) {
    try {
      await this.http.post(`/view_question/${questionId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  async getAnswerById(answerId) {
    try {
      const response = await this.http.get(`/get_answer/${answerId}`);
      return fromAnswersResponseData(response.data);
    } catch (err) {
      if (err?.response?.status === 404) {
        return null;
      }
      throw new Error(err.response.data.message);
    }
  }

  async likeQuestion(token, questionId) {
    return await this.likeOrDislikeRequest(token, "like_question", questionId);
  }

  async dislikeQuestion(token, questionId) {
    return await this.likeOrDislikeRequest(
      token,
      "dislike_question",
      questionId,
    );
  }

  async likeAnswer(token, answerId) {
    return await this.likeOrDislikeRequest(token, "like_answer", answerId);
  }

  async dislikeAnswer(token, answerId) {
    return await this.likeOrDislikeRequest(token, "dislike_answer", answerId);
  }

  async likeOrDislikeRequest(token, url, entityId) {
    try {
      const response = await this.http.post(`/${url}/${entityId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        likes: response.data.likes,
        dislikes: response.data.dislikes,
        message: response.data.message,
      };
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }

  async deleteQuestion(token, questionId) {
    return await this.deleteEntity(token, "delete_question", questionId);
  }

  async deleteAnswer(token, answerId) {
    return await this.deleteEntity(token, "delete_answer", answerId);
  }

  async deleteEntity(token, url, entityId) {
    try {
      await this.http.delete(`/${url}/${entityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }
}

export default ServerQuestionService;
