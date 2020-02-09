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

from model_classes import Profile, Skill, User, Topic, DashboardView


def calculateAge(birthDate):
    today = date.today()
    age = today.year - birthDate.year
    return age

########################################################################
WEBEX_0 = "ZDExMmEyMWYtZjgyOS00MGZlLWI4MDgtOGU3YWJhYmQ4N2IyMTlmNjQ1OWMtOTdj_PF84_ce4a2d3d-b708-4cf1-816e-049be0c172f0"
WEBEX_1 = WEBEX_0

web_handle_0 = "studybuddy@webex.bot"
web_handle_1 = "studyclient@webex.bot"

token_0 = WEBEX_0
token_1 = WEBEX_0

postgres_url = 'postgres://ffgllqemmjnrnm:c07be32cb7851a450198e43a4009a092a7c43c3678e0dc8d3ad3e309ead09669@ec2-54-246-89-234.eu-west-1.compute.amazonaws.com:5432/daahtl1du1mh0'

FAKE_PROFILES = {
    "0": Profile(0, f"{WEBEX_0}", web_handle_0, "Bobby Tables", "example.com", "Imperial College London", [Skill("Dancing", 3)], 27, token_0),
    "1": Profile(1, f"{WEBEX_1}", web_handle_1, "Ms Bobby Tables", "exampl2e.com", "Imperial Collage London", [Skill("Maths", 1)], 28, token_1)
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
engine = create_engine(postgres_url, connect_args={'connect_timeout': 10})
# Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

# -------------------------------------------------------------
# Database models:
class DBUser(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, server_default=sqlalchemy.text('User_id_seq()'))
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
        skills = session.query(DBTopic.name, DBUserTopicMap.expertise).join(DBUserTopicMap).filter(DBUserTopicMap.user_id==user.id).all()
        skills = [Skill(skill[0], skill[1]) for skill in skills]
        user_name = user.first_name + " " + user.last_name
        profile = Profile(user.id, WEBEX_0, web_handle_0, user_name, user.profile_pic, user.institution, skills, calculateAge(user.date_of_birth), token_0)
        profile_json = {
            "profile_id": profile.profile_id,
            "webex_id": profile.webex_id,
            "webex_handle": profile.webex_handle,
            "name": profile.name,
            "image_url": profile.image_url,
            "institution": profile.institution,
            "skills": profile.skills,
            "age": profile.age,
            "tokens": profile.tokens,
        }
        list_users.append(profile_json)
    print(list_users[0])
    return jsonify(list_users)


# The backend will aggregate what it thins is the best possible dashboard for the user.
@app.route('/dashboard/<topic_id>', methods=['GET'])
def get_dashboard_with_topic(topic_id):
    skilled_users = DBUserTopicMap.query.filter_by(topic_id=topic_id).all()
    list_users = []
    for u in skilled_users:
        user = session.query(DBUser).join(DBUserTopicMap).filter(DBUser.id == u.user_id).first()
        if user is not None:
            skills = session.query(DBTopic.name, DBUserTopicMap.expertise).join(DBUserTopicMap).filter(DBUserTopicMap.user_id == u.id).all()
            skills = [Skill(skill[0], skill[1]) for skill in skills]
            user_name = user.first_name + " " + user.last_name
            profile = Profile(user.id, WEBEX_0, web_handle_0, user_name, user.profile_pic, user.institution, skills,
                              calculateAge(user.date_of_birth), token_0)
            profile_json = {
                "profile_id": profile.profile_id,
                "webex_id": profile.webex_id,
                "webex_handle": profile.webex_handle,
                "name": profile.name,
                "image_url": profile.image_url,
                "institution": profile.institution,
                "skills": profile.skills,
                "age": profile.age,
                "tokens": profile.tokens,
            }
            list_users.append(profile_json)
    return jsonify(list_users)


# Get a specific profile with a give ID
@app.route('/profile/<profile_id>', methods=['GET'])
def get_profile(profile_id):
    # try:
    #     user_account_id = request.headers['Account-Id']
    #     print(user_account_id)
    # except:
    #     print("User did not specify an Account Id when performing the request!")
    # user = DBUser.query.filter_by(id=profile_id).first()
    user = session.query(DBUser).filter_by(id=profile_id).first()
    print(profile_id)
    print('user', user.id)
    output_user = User(user.id, user.first_name, user.last_name, user.date_of_birth, user.institution, user.description, user.profile_pic, token_0)
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

# Gets a graph of relationships
@app.route('/knowledge_graph', methods=['GET'])
def knowledge_graph():
    try:
        user_account_id = request.headers['Account-Id']
        print(user_account_id)
    except:
        print("User did not specify an Account Id when performing the request!")
    friends_left = session.query(DBUser, DBSubject).join(
                DBUserTopicMap, DBUser.id == DBUserTopicMap.user_id).join(
                DBTopic, DBUserTopicMap.topic_id == DBTopic.id).join(
                DBSubject, DBSubject.id == DBTopic.subject_id).join(        
                DBFriend, DBFriend.user_id1 == DBUser.id).filter(
                DBFriend.user_id2 == user_account_id and DBFriend.status == 1).all()
    friends_right = session.query(DBUser, DBSubject).join(
                DBUserTopicMap, DBUser.id == DBUserTopicMap.user_id).join(
                DBTopic, DBUserTopicMap.topic_id == DBTopic.id).join(
                DBSubject, DBSubject.id == DBTopic.subject_id).join(        
                DBFriend, DBFriend.user_id2 == DBUser.id).filter(
                DBFriend.user_id1 == user_account_id and DBFriend.status == 1).all()
    friends_left.extend(friends_right)

    myself = session.query(DBUser).filter(DBUser.id == user_account_id).first();
    return jsonify({
        'myself': {
            'first': myself.first_name,
            'last': myself.last_name
        },
        'friends': 
        [
            {
                'first': friend.first_name,  
                'last': friend.last_name,
                'subject': subject.name

            } for friend, subject in friends_left]
        });


# Runs the app:
if __name__ == '__main__':
    app.run(debug=True)

