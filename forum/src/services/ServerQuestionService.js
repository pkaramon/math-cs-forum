import axios from "axios";
import FakeQuestionService from "./FakeQuestionService";

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
      const tags = data["tags"].trim() === "" ? [] : data["tags"].split(",");
      return {
        id: data["id"],
        title: data["title"],
        question: data["question"],
        tags: tags,
        likes: data["likes"],
        dislikes: data["dislikes"],
        views: data["views"],
        modifiedAt: new Date(data["modified_at"]),
        addedAt: new Date(data["added_at"]),
        numberOfAnswers: data["total_answers"],
        author: {
          authorId: data["author"]["author_id"],
          firstName: data["author"]["firstname"],
          lastName: data["author"]["lastname"],
        },
        answers: data["answers"].map((answer) => ({
          answerId: answer["answer_id"],
          answer: answer["answer"],
          likes: answer["likes"],
          dislikes: answer["dislikes"],
          modifiedAt: new Date(answer["modified_at"]),
          addedAt: new Date(answer["added_at"]),
          author: {
            authorId: answer["author"]["author_id"],
            firstName: answer["author"]["firstname"],
            lastName: answer["author"]["lastname"],
          },
        })),
      };
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
}

export default ServerQuestionService;
