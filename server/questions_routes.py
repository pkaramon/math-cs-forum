from flask import jsonify, request
from models import db, Question, Answer, QuestionLike, User, AnswerLike
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime


@jwt_required()
def add_question():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    question = Question(
        title=data['title'],
        question=data['question'],
        tags=data['tags'],
        author_id=current_user_id
    )
    db.session.add(question)
    db.session.commit()
    return jsonify({'message': 'Question added successfully', 'question_id': question.id}), 201


@jwt_required()
def add_answer(question_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    answer = Answer(
        answer=data['answer'],
        question_id=question_id,
        author_id=current_user_id
    )
    db.session.add(answer)
    db.session.commit()
    return jsonify({'message': 'Answer added successfully', 'answer_id': answer.id}), 201


@jwt_required()
def modify_question(question_id):
    current_user_id = get_jwt_identity()
    question = Question.query.filter_by(id=question_id, author_id=current_user_id).first()

    if question is None:
        return jsonify({'message': 'Question not found or you do not have permission to modify it'}), 404

    data = request.get_json()
    question.title = data.get('title', question.title)
    question.question = data.get('question', question.question)
    question.tags = data.get('tags', question.tags)
    question.modified_at = datetime.utcnow()

    db.session.commit()
    return jsonify({'message': 'Question updated successfully'}), 200


@jwt_required()
def modify_answer(answer_id):
    current_user_id = get_jwt_identity()
    answer = Answer.query.filter_by(id=answer_id, author_id=current_user_id).first()

    if answer is None:
        return (
            jsonify(
                {
                    "message": "Answer not found or you do not have permission to modify it"
                }
            ),
            404,
        )

    data = request.get_json()
    answer.answer = data.get("answer", answer.answer)
    answer.modified_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Answer updated successfully"}), 200


def search_questions():
    query = request.args.get("text", "")
    tags = request.args.getlist("tags")
    sort_by = request.args.get("sortedBy", "added_at")
    skip = int(request.args.get("skip", 0))
    limit = int(request.args.get("limit", 100))

    questions_query = Question.query

    if query:
        questions_query = questions_query.filter(
            Question.title.contains(query) | Question.question.contains(query)
        )
    if tags:
        for tag in tags:
            questions_query = questions_query.filter(Question.tags.contains(tag))

    # Sortowanie wyników
    if sort_by == "addedAt":
        questions_query = questions_query.order_by(Question.added_at.desc())
    elif sort_by == "modifiedAt":
        questions_query = questions_query.order_by(Question.modified_at.desc())
    elif sort_by == "likes":
        questions_query = questions_query.order_by(Question.likes.desc())

    questions_page = questions_query.offset(skip).limit(limit).all()

    questions_data = [
        {
            "id": question.id,
            "title": question.title,
            "question": question.question,
            "tags": question.tags,
            "added_at": question.added_at,
            "modified_at": question.modified_at,
            "likes": question.likes,
            "author_id": question.author_id,
        }
        for question in questions_page
    ]

    return jsonify(questions_data), 200


def get_all_questions():
    questions = Question.query.all()
    questions_data = [
        {
            "id": question.id,
            "title": question.title,
            "question": question.question,
            "tags": question.tags,
            "added_at": question.added_at.strftime("%Y-%m-%d %H:%M:%S"),
            "modified_at": question.modified_at.strftime("%Y-%m-%d %H:%M:%S"),
            "likes": question.likes,
            "dislikes": question.dislikes,
            "author_id": question.author_id,
            "views": question.views,
        }
        for question in questions
    ]

    return jsonify(questions_data), 200

def get_all_answers(question_id):
    answers = Answer.query.filter_by(question_id=question_id).all()
    if not answers:
        return jsonify(message="No answers found for this question"), 404

    answers_data = [{
        'id': answer.id,
        'answer': answer.answer,
        'question_id': answer.question_id,
        'author_id': answer.author_id,
        'added_at': answer.added_at.strftime("%Y-%m-%d %H:%M:%S"),
        'modified_at': answer.modified_at.strftime("%Y-%m-%d %H:%M:%S"),
        'likes': answer.likes
    } for answer in answers]

    return jsonify(answers_data), 200


@jwt_required()
def like_question(question_id):
    current_user_id = get_jwt_identity()
    question = Question.query.get(question_id)

    if not question:
        return jsonify({"message": "Question not found"}), 404

    existing_reaction = QuestionLike.query.filter_by(
        user_id=current_user_id, question_id=question_id
    ).first()

    if existing_reaction:
        if existing_reaction.is_like:
            return jsonify({"message": "User has already liked this question"}), 400
        else:
            existing_reaction.is_like = True
            question.likes += 1
            question.dislikes -= 1
    else:
        db.session.add(
            QuestionLike(user_id=current_user_id, question_id=question_id, is_like=True)
        )
        question.likes += 1

    db.session.commit()

    return jsonify({"message": "Question liked successfully"}), 200


@jwt_required()
def dislike_question(question_id):
    current_user_id = get_jwt_identity()
    question = Question.query.get(question_id)

    if not question:
        return jsonify({"message": "Question not found"}), 404

    existing_reaction = QuestionLike.query.filter_by(
        user_id=current_user_id, question_id=question_id
    ).first()

    if existing_reaction:
        if not existing_reaction.is_like:
            return jsonify({"message": "User has already disliked this question"}), 400
        else:
            existing_reaction.is_like = False
            question.dislikes += 1
            question.likes -= 1
    else:
        db.session.add(
            QuestionLike(
                user_id=current_user_id, question_id=question_id, is_like=False
            )
        )
        question.dislikes += 1

    db.session.commit()

    return jsonify({"message": "Question disliked successfully"}), 200

@jwt_required()
def like_answer(answer_id):
    current_user_id = get_jwt_identity()
    answer = Answer.query.get(answer_id)

    if not answer:
        return jsonify({"message": "Answer not found"}), 404

    existing_like = AnswerLike.query.filter_by(
        user_id=current_user_id, answer_id=answer_id
    ).first()

    if existing_like:
        if existing_like.is_like:
            return jsonify({"message": "You have already liked this answer"}), 400
        else:
            existing_like.is_like = True
            answer.likes += 1
            answer.dislikes -=1
    else:
        db.session.add(
            AnswerLike(user_id=current_user_id, answer_id=answer_id, is_like=True)
        )
        answer.likes += 1

    db.session.commit()

    return jsonify({"message": "Answer liked successfully"}), 200


@jwt_required()
def dislike_answer(answer_id):
    current_user_id = get_jwt_identity()
    answer = Answer.query.get(answer_id)

    if not answer:
        return jsonify({"message": "Answer not found"}), 404

    existing_like = AnswerLike.query.filter_by(
        user_id=current_user_id, answer_id=answer_id
    ).first()

    if existing_like:
        if not existing_like.is_like:
            return jsonify({"message": "You have already disliked this answer"}), 400
        else:
            existing_like.is_like = False
            answer.dislikes += 1
            answer.likes -= 1
    else:
        db.session.add(
            AnswerLike(user_id=current_user_id, answer_id=answer_id, is_like=False)
        )
        answer.dislikes += 1

    db.session.commit()

    return jsonify({"message": "Answer disliked successfully"}), 200


@jwt_required()
def delete_question(question_id):
    current_user_id = get_jwt_identity()
    question = Question.query.get(question_id)

    if not question:
        return jsonify({"message": "Question not found"}), 404

    # Check if the current user is either the author of the question or an admin
    if (
        question.author_id != current_user_id
        and not User.query.get(current_user_id).role == "admin"
    ):
        return jsonify({"message": "Unauthorized action"}), 403

    db.session.delete(question)
    db.session.commit()

    return jsonify({"message": "Question deleted successfully"}), 200


@jwt_required()
def delete_answer(answer_id):
    current_user_id = get_jwt_identity()
    answer = Answer.query.get(answer_id)

    if not answer:
        return jsonify({"message": "Answer not found"}), 404

    # Check if the current user is either the author of the answer or an admin
    if (
        answer.author_id != current_user_id
        and not User.query.get(current_user_id).role == "admin"
    ):
        return jsonify({"message": "Unauthorized action"}), 403

    db.session.delete(answer)
    db.session.commit()

    return jsonify({"message": "Answer deleted successfully"}), 200
