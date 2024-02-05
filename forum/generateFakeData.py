import json
import random
from datetime import datetime, timedelta

def generate_name():
    first_names = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]
    return f"{random.choice(first_names)} {random.choice(last_names)}"

def generate_latex():
    # Define some LaTeX templates for "big" and "inline" equations
    big_latex_templates = [
        r"$$ \int \sqrt{x+3} \, dx $$",
        r"$$ \sum_{n=1}^{\infty} \frac{1}{n^2} $$",
        r"$$ \lim_{x \to \infty} \exp(-x) = 0 $$"
    ]
    inline_latex_templates = [
        r"$\sqrt{x+3}$",
        r"$\frac{1}{n^2}$",
        r"$\exp(-x)$"
    ]

    if random.choice([True, False]):
        return random.choice(big_latex_templates)
    else:
        return random.choice(inline_latex_templates)


def generate_users():
    return [generate_user(i+1) for i in range(100)]


def generate_user(index):
    firstName = generate_name().split()[0]
    return {
        "userId": index,
        "firstName": firstName,
        "lastName": generate_name().split()[1],
        "password": "password123",
        "email": f"{firstName}{index}@example.com",
        "birthDate": f"{random.randint(1950, 2000)}-{random.randint(1,12)}-01",
        "role": "user",
        "about": "I'm a software engineer with a passion for machine learning and data analysis. I'm also a big fan of functional programming and I'm currently learning Haskell."
    }

def generate_question(index, author, allAuthors):
    question_template = """How can I {action} in {language}? {latex}"""
    actions = ["integrate a function", "optimize performance", "implement an algorithm", "manage state", "handle errors"]
    languages = ["Python", "JavaScript", "C#", "Java", "Go"]
    latex_snippet = generate_latex()

    numberOfAnswers = random.randint(0, 10)

    return {
        "id": index,
        "title": f"Question {index}",
        "question": question_template.format(action=random.choice(actions), language=random.choice(languages), latex=latex_snippet),
        "tags": random.sample(["Programming", "Web Development", "Data Analysis", "Machine Learning", "Software Engineering"], 3),
        "addedAt": (datetime.now() - timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d %H:%M:%S'),
        "modifiedAt": (datetime.now() - timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d %H:%M:%S'),
        "likes": random.randint(0, 100),
        "dislikes": random.randint(0, 100),
        "author": {
            "firstName": author['firstName'],
            "lastName": author['lastName'],
            "authorId": author['userId']
        },
        "views": random.randint(0, 1000),
        "numberOfAnswers": numberOfAnswers,
        "answers": [generate_answer(index, random.choice(allAuthors)) for _ in range(numberOfAnswers)],
    }

def generate_questions(n, authors):
    return [generate_question(i, random.choice(authors), authors) for i in range(1, n + 1)]


def generate_answer(question_id, author):
    return {
        "author": {
            "authorId": author['userId'],
            "firstName": author['firstName'],
            "lastName": author['lastName']
        },
        "answer": generate_latex(),
        "answerId": str(random.randint(1, 10000)),
        "addedAt": (datetime.now() - timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d %H:%M:%S'),
        "modifiedAt": (datetime.now() - timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d %H:%M:%S'),
        "questionId": question_id,
        "likes": random.randint(0, 100),
        "dislikes": random.randint(0, 100),
    }

users = generate_users()
questions = generate_questions(100, users)

with open('./src/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=4)

with open('./src/users.json', 'w', encoding='utf-8') as f:
    json.dump(users, f, indent=4)

