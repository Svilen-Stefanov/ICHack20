import sqlalchemy
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime
from sqlalchemy.orm import backref, relationship, session
from flask_cors import CORS
from flask import jsonify
from flask import request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date
from dataclasses import dataclass
from dataclasses_json import dataclass_json, LetterCase
from typing import List

from model_classes import Profile, Skill, User, Topic, DashboardView


def calculateAge(birthDate):
    today = date.today()
    age = today.year - birthDate.year
    return age

########################################################################
WEBEX_0 = "MjczYjg1ZDgtYzQxNy00ZTljLTlkN2ItYzE5NzhmOGU3ZTFmNjdiZjRhYzctNzcx_PF84_ce4a2d3d-b708-4cf1-816e-049be0c172f0"
WEBEX_1 = "M2E2N2E3ZmMtNDQwYy00MTkxLWFkOGEtY2EyNzRlZTRkNWJlYzYxYjJjZjgtZGQz_PF84_ce4a2d3d-b708-4cf1-816e-049be0c172f0"

web_handle_0 = "studybuddy@webex.bot"
web_handle_1 = "studyclient@webex.bot"


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


postgres_url = 'postgres://ffgllqemmjnrnm:c07be32cb7851a450198e43a4009a092a7c43c3678e0dc8d3ad3e309ead09669@ec2-54-246-89-234.eu-west-1.compute.amazonaws.com:5432/daahtl1du1mh0'

########################################################################
<<<<<<< HEAD
WEBEX_0 = "ZDExMmEyMWYtZjgyOS00MGZlLWI4MDgtOGU3YWJhYmQ4N2IyMTlmNjQ1OWMtOTdj_PF84_ce4a2d3d-b708-4cf1-816e-049be0c172f0"
WEBEX_1 = "ZDExMmEyMWYtZjgyOS00MGZlLWI4MDgtOGU3YWJhYmQ4N2IyMTlmNjQ1OWMtOTdj_PF84_ce4a2d3d-b708-4cf1-816e-049be0c172f0"

FAKE_PROFILES = {
    "0": Profile(0, f"{WEBEX_0}", "studybuddy9@webex.bot", "Bobby Tables", "example.com", "Imperial College London", [Skill("Dancing", 3)], 27, 3.42),
    "1": Profile(1, f"{WEBEX_1}", "studyclient9@webex.bot", "Ms Bobby Tables", "exampl2e.com", "Imperial Collage London", [Skill("Maths", 1)], 28, 2.42)
=======
token_0 = "MjczYjg1ZDgtYzQxNy00ZTljLTlkN2ItYzE5NzhmOGU3ZTFmNjdiZjRhYzctNzcx_PF84_ce4a2d3d-b708-4cf1-816e-049be0c172f0"
token_1 = "M2E2N2E3ZmMtNDQwYy00MTkxLWFkOGEtY2EyNzRlZTRkNWJlYzYxYjJjZjgtZGQz_PF84_ce4a2d3d-b708-4cf1-816e-049be0c172f0"

FAKE_PROFILES = {
    "0": Profile(0, f"{WEBEX_0}", web_handle_0, "Bobby Tables", "example.com", "Imperial College London", [Skill("Dancing", 3)], 27, token_0),
    "1": Profile(1, f"{WEBEX_1}", web_handle_1, "Ms Bobby Tables", "exampl2e.com", "Imperial Collage London", [Skill("Maths", 1)], 28, token_1)
>>>>>>> master
}


app = Flask(__name__)
# Allow Cross-origin policy on all endpoints
CORS(app)

# -------------------------------------------------------------
# Database connection:
app.config[
    'SQLALCHEMY_DATABASE_URI'] = postgres_url

db = SQLAlchemy(app)

# Connect to Database and create database session
engine = create_engine(postgres_url)
# Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()


# -------------------------------------------------------------
# Database models:
class DBUser(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text(
        'User_id_seq()'))
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=True)
    date_of_birth = db.Column(DateTime)
    institution = db.Column(db.String(30), nullable=True)
    description = db.Column(db.String(2000), nullable=True)
    profile_pic = db.Column(db.String(500), nullable=True)


class DBSubject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text(
        'subjects_id_seq()'))
    name = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(1000), nullable=True)
    topics = relationship('DBTopic')


class DBTopic(db.Model):
    __tablename__ = 'topics'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text(
        'topics_id_seq()'))
    name = db.Column(db.String(30), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), primary_key=False, unique=True)
    description = db.Column(db.String(1000), nullable=True)
    user_topic_map = relationship('DBUserTopicMap', back_populates=__tablename__, uselist=False)


class DBFriend(db.Model):
    __tablename__ = 'friends'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text(
        'friends_id_seq()'))
    user_id1 = db.Column(db.Integer, db.ForeignKey('user.id'), unique=False, nullable=False)
    user_id2 = db.Column(db.Integer, db.ForeignKey('user.id'), unique=False, nullable=False)
    status = db.Column(db.Integer)


class DBUserTopicMap(db.Model):
    __tablename__ = 'user_topic_map'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text(
        'user_topic_map_id_seq()'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=False, nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), unique=False, nullable=False)
    expertise = db.Column(db.Integer, nullable=True)
    topics = relationship('DBTopic', back_populates=__tablename__, uselist=False)


# -------------------------------------------------------------
# Main dashboard view.
@app.route('/dashboard', methods=['GET'])
def get_dashboard():
    all_users = DBUser.query.all()
    list_users = []
    for user in all_users:
        skills = session.query(DBUserTopicMap.topics).filter(DBUserTopicMap.user_id==user.id).all()
        user_name = user.first_name + " " + user.last_name
        profile = Profile(user.id, WEBEX_0, web_handle_0, user_name, user.profile_pic, user.institution, skills, calculateAge(user.date_of_birth), token_0)
        list_users.append(profile)
    return jsonify(list_users)


# The backend will aggregate what it thins is the best possible dashboard for the user.
@app.route('/dashboard/<topic_id>', methods=['GET'])
def get_dashboard_with_topic(topic_id):
    skilled_users = DBUserTopicMap.query.filter_by(topic_id=topic_id).all()
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
    user = DBUser.query.filter_by(id=profile_id).first()
    output_user = User(user.user_id, user.first_name, user.last_name, user.date_of_birth, user.institution, user.profile_pic)
    return jsonify(output_user)


# Get a list of all topics
@app.route('/all_topics', methods=['GET'])
def get_all_topics():
    topics = DBTopic.query.all()
    all_topics = []
    for t in topics:
        all_topics.append(Topic(t.id, t.name, t.subject_id, t.description))
    return jsonify(all_topics)


# Get a specific topic with a give topic ID
@app.route('/topic/<topic_id>', methods=['GET'])
def get_topic(topic_id):
    t = DBTopic.query.filter_by(id=topic_id).first()
    topic = Topic(t.id, t.name, t.subject_id, t.description)
    return jsonify(topic)


# Gets a list of all subjects
@app.route('/subjects', methods=['GET'])
def get_subjects():

    # Get all subjects from db, impose upper limit on number of subjects returned
    subjects_from_db = DBSubject.query.order_by(Subject.name).limit(100).all()
    subjects_to_send = []
    for subject in subjects_from_db:
        sub = {
            'name': subject.name,
            'description': subject.description
        }
        subjects_to_send.append(sub)

    return jsonify({'subjects': subjects_to_send})


# Gets a list of all subjects with their topics
@app.route('/subjects_with_topics', methods=['GET'])
def get_subjects_with_topics():

    # Get all subjects from db, impose upper limit on number of subjects returned
    subjects_from_db = DBSubject.query.order_by(Subject.name).limit(100).all()
    subjects_to_send = []
    for subject in subjects_from_db:

        topics = []
        for topic in subject.topics:
            top = {
                'name': topic.name,
                'description': topic.description
                }
            topics.append(top)

        sub = {
            'name': subject.name,
            'description': subject.description,
            'topics': topics
        }

        subjects_to_send.append(sub)

    return jsonify({'subjects': subjects_to_send})


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
