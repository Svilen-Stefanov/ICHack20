import sqlalchemy
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import jsonify

from dataclasses import dataclass
from dataclasses_json import dataclass_json, LetterCase

from typing import List

########################################################################
# Return dataclass Definitions
@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Skill:
    skill_name: str
    experience_level: int

@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Profile:
    profile_id: int
    name: str
    image_url: str
    institution: str
    skills: List[Skill]
    age: str
    tokens: float

@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class DashboardView:
    profiles: List[Profile]

@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class EnhancedProfile:
    brief: Profile
    description: str 

########################################################################



app = Flask(__name__)
CORS(app)

@app.route('/test', methods=['GET'])
def test():
    return "API works! :D"

# Main dashboard view.
# The backend will aggregate what it thins is the best possible dashboard for the user.
@app.route('/dashboard', methods=['GET'])
def get_dashboard():
    fake_return = DashboardView([Profile(0, "Bobby Tables", "example.com", "Imperial College London", [Skill("Dancing", 3)], 27, 3.42)])
    return jsonify(fake_return)



# Runs the app:
if __name__ == '__main__':
    app.run(debug=True)
