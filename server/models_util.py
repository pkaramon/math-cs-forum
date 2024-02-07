from models import User, Answer, Question


def create_question_data(question):
    author = User.query.get(question.author_id)
    answers = Answer.query.filter_by(question_id=question.id).all()
    question_data = {
        "id": question.id,
        "title": question.title,
        "question": question.question,
        "tags": question.tags,
        "added_at": str(question.added_at),
        "modified_at": str(question.modified_at),
        "likes": question.likes,
        "dislikes": question.dislikes,
        "author_id": question.author_id,
        "views": question.views,
        # "approved": question.approved,
        "author": {
            "author_id": author.id,
            "firstname": author.firstname,
            "lastname": author.lastname,
        },
        "answers": [
            create_answer_data(answer) for answer in answers
        ],
        "total_answers": Answer.query.filter_by(question_id=question.id).count()
    }
    return question_data


def create_answer_data(answer):
    author = User.query.get(answer.author_id)
    answer_data = {
        "answer_id": answer.id,
        "answer": answer.answer,
        "added_at": str(answer.added_at),
        "modified_at": str(answer.modified_at),
        "question_id": answer.question_id,
        "likes": answer.likes,
        "dislikes": answer.dislikes,
        "question_title": Question.query.get(answer.question_id).title,
        "author": {
            "author_id": author.id,
            "firstname": author.firstname,
            "lastname": author.lastname,
        },
    }
    return answer_data
