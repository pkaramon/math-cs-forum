import * as Yup from "yup";

class UserProfileData {
  constructor({
    userId,
    firstName,
    lastName,
    newestQuestions,
    newestAnswers,
    totalQuestions,
    totalAnswers,
  }) {
    try {
      userProfileSchema.validateSync({
        userId,
        firstName,
        lastName,
        newestQuestions,
        newestAnswers,
        totalQuestions,
        totalAnswers,
      });
    } catch (error) {
      console.log("Invalid user profile data", error.message);
      throw error;
    }

    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.newestQuestions = newestQuestions;
    this.newestAnswers = newestAnswers;
    this.totalQuestions = totalQuestions;
    this.totalAnswers = totalAnswers;
  }
}

const userProfileQuestionData = Yup.object().shape({
  id: Yup.number().required(),
  title: Yup.string().required(),
  addedAt: Yup.date().required(),
  modifiedAt: Yup.date().required(),
  views: Yup.number().required(),
  numberOfAnswers: Yup.number().required(),
  likes: Yup.number().required(),
});

const userProfileAnswerData = Yup.object().shape({
  answerId: Yup.number().required(),
  questionId: Yup.number().required(),
  questionTitle: Yup.string().required(),
  addedAt: Yup.date().required(),
  modifiedAt: Yup.date().required(),
  likes: Yup.number().required(),
});

const userProfileSchema = Yup.object().shape({
  userId: Yup.number().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  newestQuestions: Yup.array().of(userProfileQuestionData),
  newestAnswers: Yup.array().of(userProfileAnswerData),
  totalQuestions: Yup.number().required(),
  totalAnswers: Yup.number().required(),
});

export default UserProfileData;
