import users from "../users.json";
import questions from "../questions.json";
import UserProfileData from "../entities/UserProfileData";

class FakeUserService {
  constructor() {
    this.users = users;
  }

  async findByIdForPublicProfile(id) {
    await this.wait(1000);
    const user = this.users.find((user) => user.userId === id);
    if (!user) {
      return null;
    }

    const newestQuestions = questions
      .filter((question) => question.author.authorId === id)
      .sort((a, b) => b.addedAt - a.addedAt)
      .slice(0, 5);

    const newestAnswers = questions
      .flatMap((question) =>
        question.answers.map((answer) => ({
          ...answer,
          questionId: question.id,
          questionTitle: question.title,
        })),
      )
      .filter((answer) => answer.author.authorId === id)
      .sort((a, b) => b.addedAt - a.addedAt)
      .slice(0, 5);

    const totalQuestions = questions.filter(
      (question) => question.author.authorId === id,
    ).length;
    const totalAnswers = questions
      .flatMap((question) => question.answers)
      .filter((answer) => answer.author.authorId === id).length;

    return new UserProfileData({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      newestQuestions: newestQuestions,
      newestAnswers: newestAnswers,
      totalQuestions: totalQuestions,
      totalAnswers: totalAnswers,
    });
  }

  async wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}

export default FakeUserService;
