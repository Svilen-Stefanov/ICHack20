import sqlalchemy
import datetime
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime
from sqlalchemy.orm import backref, relationship, session
from flask_cors import CORS
from flask import jsonify
from flask import request

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
    webex_id: str
    webex_handle: str
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
WEBEX_0 = "ZDExMmEyMWYtZjgyOS00MGZlLWI4MDgtOGU3YWJhYmQ4N2IyMTlmNjQ1OWMtOTdj_PF84_ce4a2d3d-b708-4cf1-816e-049be0c172f0"
WEBEX_1 = "MDRiMjFkMDctZThkOC00Mzg5LTljNDAtM2QxNDU3NjYyMzYwOWMxYzhlZWUtMTcw_PF84_ce4a2d3d-b708-4cf1-816e-049be0c172f0"

FAKE_PROFILES = {
    "0": Profile(0, f"{WEBEX_0}", "studybuddy9@webex.bot", "Bobby Tables", "example.com", "Imperial College London", [Skill("Dancing", 3)], 27, 3.42),
    "1": Profile(1, f"{WEBEX_1}", "studyclient9@webex.bot", "Ms Bobby Tables", "exampl2e.com", "Imperial Collage London", [Skill("Maths", 1)], 28, 2.42)
}


app = Flask(__name__)
# Allow Cross-origin policy on all endpoints
CORS(app)

# -------------------------------------------------------------
# Database connection:
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://ffgllqemmjnrnm:c07be32cb7851a450198e43a4009a092a7c43c3678e0dc8d3ad3e309ead09669@ec2-54-246-89-234.eu-west-1.compute.amazonaws.com:5432/daahtl1du1mh0'
db = SQLAlchemy(app)


# -------------------------------------------------------------
# Database models:
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text(
        'User_id_seq()'))
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=True)
    date_of_birth = db.Column(DateTime)
    institution = db.Column(db.String(30), nullable=True)
    description = db.Column(db.String(2000), nullable=True)
    profile_pic = db.Column(db.String(500), nullable=True)


class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text(
        'subjects_id_seq()'))
    name = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(1000), nullable=True)


class Topic(db.Model):
    __tablename__ = 'topics'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text(
        'topics_id_seq()'))
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), primary_key=False, unique=True)
    

class Friend(db.Model):
    __tablename__ = 'friends'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text(
        'friends_id_seq()'))
    user_id1 = db.Column(db.Integer, db.ForeignKey('user.id'), unique=False, nullable=False)
    user_id2 = db.Column(db.Integer, db.ForeignKey('user.id'), unique=False, nullable=False)
    status = db.Column(db.Integer)


class UserTopicMap(db.Model):
    __tablename__ = 'user_topic_map'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text(
        'user_topic_map_id_seq()'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=False, nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), unique=False, nullable=False)
    expertise = db.Column(db.Integer, nullable=True)


# -------------------------------------------------------------
# Main dashboard view.
# The backend will aggregate what it thins is the best possible dashboard for the user.
@app.route('/dashboard', methods=['GET'])
def get_dashboard():
    # Retrieve the accountId specified by the user
    try:
        user_account_id = request.headers['Account-Id']
        print(user_account_id)
    except:
        print("User did not specify an Account Id when performing the request!")

    # Generate the data to be returned
    fake_return = DashboardView([FAKE_PROFILES['0'], FAKE_PROFILES['1']])
    return jsonify(fake_return)


# Get a specific profile with a give ID
@app.route('/profile/<profile_id>', methods=['GET'])
def get_profile(profile_id):
    try:
        user_account_id = request.headers['Account-Id']
        print(user_account_id)
    except:
        print("User did not specify an Account Id when performing the request!")

    # Generate the data to be returned
    "TODO: Currently returns an error stacktrace if the profile_id could not be found"
    fake_return = EnhancedProfile(FAKE_PROFILES[profile_id], "A very long description I cannot be bothered to type")
    return jsonify(fake_return)


# Gets a list of all subjects
@app.route('/subjects', methods=['GET'])
def get_subjects():

    # Get all subjects from db, impose upper limit on number of subjects returned
    subjects_from_db = Subject.query.order_by(Subject.name).limit(100).all()
    subjects_to_send = []
    for subject in subjects_from_db:
        sub = {
            'title': subject.name,
            'description': subject.description
        }
        subjects_to_send.append(sub)

    return jsonify({'subjects': subjects_to_send})

# Runs the app:
if __name__ == '__main__':
    app.run(debug=True)
