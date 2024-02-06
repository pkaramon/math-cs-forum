from datetime import datetime

from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.sql import func

from models import db, Question, Answer, QuestionLike, User, AnswerLike
from models_util import create_question_data, create_answer_data


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


def get_question(question_id):
    question = Question.query.get(question_id)
    if question is None:
        return jsonify({'message': 'Question not found'}), 404

    return jsonify(create_question_data(question)), 200


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
    query = request.args.get('query', '')
    user_id = request.args.get('user_id', None)
    tags = request.args.get('tags', '').split(',') if request.args.get('tags') else []
    sort_by = request.args.get('sort_by', 'added_at')
    sort_order = request.args.get('sort_order', 'desc')
    skip = int(request.args.get('skip', 0))
    limit = int(request.args.get('limit', 100))

    questions_query = db.session.query(
        Question, func.count(Answer.id).label('answers_count')
    ).outerjoin(Answer, Answer.question_id == Question.id)

    if user_id:
        questions_query = questions_query.filter(Question.author_id == user_id)

    if query:
        questions_query = questions_query.filter(
            Question.title.contains(query) | Question.question.contains(query)
        )

    if tags:
        for tag in tags:
            questions_query = questions_query.filter(Question.tags.contains(tag))

    # Group by Question fields to ensure correct answer count calculation
    questions_query = questions_query.group_by(Question.id)

    # Sortowanie wyników
    if sort_order == "asc":
        if sort_by == "added_at":
            questions_query = questions_query.order_by(Question.added_at.asc())
        elif sort_by == "modified_at":
            questions_query = questions_query.order_by(Question.modified_at.asc())
        elif sort_by == "likes":
            questions_query = questions_query.order_by(Question.likes.asc())
        elif sort_by == "views":
            questions_query = questions_query.order_by(Question.views.asc())
        elif sort_by == "answers":
            questions_query = questions_query.order_by("answers_count")
    else:
        if sort_by == "added_at":
            questions_query = questions_query.order_by(Question.added_at.desc())
        elif sort_by == "modified_at":
            questions_query = questions_query.order_by(Question.modified_at.desc())
        elif sort_by == "likes":
            questions_query = questions_query.order_by(Question.likes.desc())
        elif sort_by == "views":
            questions_query = questions_query.order_by(Question.views.desc())
        elif sort_by == "answers":
            questions_query = questions_query.order_by(func.count(Answer.id).desc())

    questions_page = questions_query.offset(skip).limit(limit).all()

    questions_data = [
        create_question_data(question) for question, answers_count in questions_page
    ]

    return jsonify(questions_data), 200


def get_number_of_questions_matching():
    query = request.args.get('query', '')
    user_id = request.args.get('user_id', None)
    tags = request.args.get('tags', '').split(',') if request.args.get('tags') else []

    questions_query = Question.query
    if user_id:
        questions_query = questions_query.filter(Question.author_id == user_id)

    if query:
        questions_query = questions_query.filter(
            Question.title.contains(query) | Question.question.contains(query)
        )
    if tags:
        for tag in tags:
            questions_query = questions_query.filter(Question.tags.contains(tag))
    return jsonify({"count": questions_query.count()}), 200


def search_answers():
    user_id = request.args.get('user_id', None)
    answers_query = Answer.query

    if user_id:
        answers_query = answers_query.filter_by(author_id=user_id)

    answers_query = answers_query.order_by(Answer.added_at.desc())

    answers_data = [create_answer_data(answer) for answer in answers_query.all()]
    return jsonify(answers_data), 200


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

    message = "Question liked successfully"
    if existing_reaction:
        if existing_reaction.is_like:
            db.session.delete(existing_reaction)
            question.likes -= 1
            db.session.commit()
            message = "Removed like from the question"
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
    return jsonify({"message": message, "likes": question.likes, "dislikes": question.dislikes}), 200


@jwt_required()
def dislike_question(question_id):
    current_user_id = get_jwt_identity()
    question = Question.query.get(question_id)
    if not question:
        return jsonify({"message": "Question not found"}), 404

    existing_reaction = QuestionLike.query.filter_by(
        user_id=current_user_id, question_id=question_id
    ).first()

    message = "Question disliked successfully"
    if existing_reaction:
        if not existing_reaction.is_like:
            db.session.delete(existing_reaction)
            question.dislikes -= 1
            message = "Removed dislike from the question"
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

    return jsonify({"message": message, "likes": question.likes, "dislikes": question.dislikes}), 200


@jwt_required()
def like_answer(answer_id):
    current_user_id = get_jwt_identity()
    answer = Answer.query.get(answer_id)

    if not answer:
        return jsonify({"message": "Answer not found"}), 404

    existing_like = AnswerLike.query.filter_by(
        user_id=current_user_id, answer_id=answer_id
    ).first()

    message = "Answer liked successfully"
    if existing_like:
        if existing_like.is_like:
            db.session.delete(existing_like)
            answer.likes -= 1
            message = "Removed like from the answer"
        else:
            existing_like.is_like = True
            answer.likes += 1
            answer.dislikes -= 1
    else:
        db.session.add(
            AnswerLike(user_id=current_user_id, answer_id=answer_id, is_like=True)
        )
        answer.likes += 1

    db.session.commit()

    return jsonify({"message": message, "likes": answer.likes, "dislikes": answer.dislikes}), 200


@jwt_required()
def dislike_answer(answer_id):
    current_user_id = get_jwt_identity()
    answer = Answer.query.get(answer_id)

    if not answer:
        return jsonify({"message": "Answer not found"}), 404

    existing_like = AnswerLike.query.filter_by(
        user_id=current_user_id, answer_id=answer_id
    ).first()

    message = "Answer disliked successfully"
    if existing_like:
        if not existing_like.is_like:
            db.session.delete(existing_like)
            answer.dislikes -= 1
            message = "Removed dislike from the answer"
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

    return jsonify({"message": message, "likes": answer.likes, "dislikes": answer.dislikes}), 200


@jwt_required()
def delete_question(question_id):
    current_user_id = get_jwt_identity()
    question = Question.query.get(question_id)

    if not question:
        return jsonify({"message": "Question not found"}), 404

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
