export function fromQuestionResponseData(data) {
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
    answers: data["answers"].map((answer) => fromAnswersResponseData(answer)),
  };
}

export function fromAnswersResponseData(data) {
  return {
    answerId: data["answer_id"],
    answer: data["answer"],
    likes: data["likes"],
    dislikes: data["dislikes"],
    modifiedAt: new Date(data["modified_at"]),
    addedAt: new Date(data["added_at"]),
    questionId: data["question_id"],
    questionTitle: data["question_title"],
    verified: data["verified"],
    author: {
      authorId: data["author"]["author_id"],
      firstName: data["author"]["firstname"],
      lastName: data["author"]["lastname"],
    },
  };
}
