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
    # Randomly choose to include a "big" or "inline" LaTeX block
    if random.choice([True, False]):
        return random.choice(big_latex_templates)
    else:
        return random.choice(inline_latex_templates)

def generate_question(index):
    question_template = """How can I {action} in {language}? {latex}"""
    actions = ["integrate a function", "optimize performance", "implement an algorithm", "manage state", "handle errors"]
    languages = ["Python", "JavaScript", "C#", "Java", "Go"]
    latex_snippet = generate_latex()

    return {
        "title": f"Question {index}",
        "question": question_template.format(action=random.choice(actions), language=random.choice(languages), latex=latex_snippet),
        "tags": random.sample(["Programming", "Web Development", "Data Analysis", "Machine Learning", "Software Engineering"], 3),
        "addedAt": (datetime.now() - timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d %H:%M:%S'),
        "modifiedAt": (datetime.now() - timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d %H:%M:%S'),
        "likes": random.randint(0, 100),
        "author": {
            "firstName": generate_name().split()[0],
            "lastName": generate_name().split()[1],
            "id": str(index)  # Simplified ID generation for demonstration
        },
        "views": random.randint(0, 1000),
        "answers": random.randint(0, 10),
    }

def generate_questions(n):
    return [generate_question(i) for i in range(1, n + 1)]

# Generate 100 questions
questions = generate_questions(100)

# Convert the list of questions to a JSON-formatted string
json_output = json.dumps(questions, indent=4)
print(json_output)