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

# Importing vault:
import sys,os

sys.path.append(os.path.join(os.path.dirname(__file__), "../vault/py_tm_vault_client_release_0.1.0_team5/py_tm_vault_client"))
# from tmvault import TMVaultClient

# accounts_for_person_a = client.accounts.list_accounts_for_customer('5320319443367695238')
# print(accounts_for_person_a[0].name)


def calculateAge(birthDate):
    today = date.today()
    age = today.year - birthDate.year
    return age

########################################################################
WEBEX_0 = "MDRiMjFkMDctZThkOC00Mzg5LTljNDAtM2QxNDU3NjYyMzYwOWMxYzhlZWUtMTcw_PF84_ce4a2d3d-b708-4cf1-816e-049be0c172f0"
WEBEX_1 = WEBEX_0

web_handle_0 = "studybuddy@webex.bot"
web_handle_1 = "studyclient@webex.bot"

token_0 = WEBEX_0
token_1 = WEBEX_0

postgres_url = 'postgres://ffgllqemmjnrnm:c07be32cb7851a450198e43a4009a092a7c43c3678e0dc8d3ad3e309ead09669@ec2-54-246-89-234.eu-west-1.compute.amazonaws.com:5432/daahtl1du1mh0'

user0_id = 2229561152441835583
user1_id = 8360390402314484225

# vault_client = TMVaultClient('../vault/py_tm_vault_client_release_0.1.0_team5/data/vault-config.json')

FAKE_PROFILES = {
    "0": Profile(user0_id, f"{WEBEX_0}", web_handle_0, "Bobby Tables", "example.com", "Imperial College London", [Skill("Dancing", 3)], 27, token_0),
    "1": Profile(user1_id, f"{WEBEX_1}", web_handle_1, "Ms Bobby Tables", "exampl2e.com", "Imperial Collage London", [Skill("Maths", 1)], 28, token_1)
}

#FAKE_ACCOUNTS = {
#   "0" : vault_client.accounts.create_account(product_id="", stakeholder_customer_ids=[str(user0_id)])
#}

#accounts_for_person_a = vault_client.customers.get_customers(customer_ids=[str(user0_id)])
# accounts_for_person_b = vault_client.accounts.list_accounts_for_customer(customer_id=str(user0_id))
#print(accounts_for_person_a)


app = Flask(__name__)

# Allow Cross-origin policy on all endpoints
CORS(app)

# -------------------------------------------------------------
# Database connection:
app.config[
    'SQLALCHEMY_DATABASE_URI'] = postgres_url

db = SQLAlchemy(app)

# Connect to Database and create database session
engine = create_engine(postgres_url, pool_size=20, max_overflow=0, connect_args={'connect_timeout': 10})
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
    money = db.Column(db.Integer, nullable=False)


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
    user_id0 = 0
    try:
        user_id0 = request.headers['Account-Id']
    except:
        print("User did not specify an Account Id when performing the request!")
    all_users = DBUser.query.order_by(sqlalchemy.desc(DBUser.money)).all()
    all_users = all_users[:15]
    list_users = []
    for user in all_users:
        # status = session.query(DBFriend.status).filter(
            # (DBFriend.user_id1 == user_id0 or DBFriend.user_id2 == user_id0) and (DBFriend.user_id1 == user.id or DBFriend.user_id2 == user.id)).all()
        user_id = user.id
        status_left = session.query(DBFriend.status).filter_by(user_id1=user_id0, user_id2=user_id).all()
        status_right = session.query(DBFriend.status).filter_by(user_id1=user_id, user_id2=user_id0).all()
        status = []
        status.extend(status_left)
        status.extend(status_right)
        if status == []:
            status = 0
        else:
            status = status[0][0]

        print('num', status)
        skills = session.query(DBTopic.name, DBUserTopicMap.expertise).join(DBUserTopicMap).filter(DBUserTopicMap.user_id==user.id).all()
        skills = [Skill(skill[0][0] + skill[0][1:].lower(), skill[1]) for skill in skills]
        user_name = user.first_name + " " + user.last_name
        profile = Profile(profile_id=user.id, webex_id=WEBEX_0, webex_handle=web_handle_0, name=user_name, image_url=user.profile_pic, institution=user.institution, skills=skills, age=calculateAge(user.date_of_birth), tokens=token_0)
        print(user_id0, status)
        profile_json = {
            "profile_id": profile.profile_id,
            "webex_id": profile.webex_id,
            "webex_handle": profile.webex_handle,
            "name": profile.name,
            "image_url": profile.image_url,
            "institution": profile.institution,
            "skills": profile.skills,
            "age": profile.age,
            "token": profile.tokens,
            "status": status,
        }
        list_users.append(profile_json)
    return jsonify(list_users)


# Create a friendship
@app.route('/dashboard', methods=['PUT'])
def set_friendship():
    data = request.get_json()
    user_id0 = None
    try:
        user_id0 = data['user_id']
    except:
        print("Received data with invalid format!")

    user_id1 = None
    try:
        user_id1 = request.headers['Account-Id']
    except:
        print("User did not specify an Account Id when performing the request!")

    print(user_id0)
    print(user_id1)
    if user_id0 is not None and user_id1 is not None:
        status_left = session.query(DBFriend.status).filter_by(user_id1=user_id0, user_id2=user_id1).all()
        status_right = session.query(DBFriend.status).filter_by(user_id1=user_id1, user_id2=user_id0).all()
        status = []
        status.extend(status_left)
        status.extend(status_right)
        if status == []:
            friendship = DBFriend(user_id1=user_id0, user_id2=user_id1, status=1)
            session.add(friendship)
        else:
            session.query(DBFriend).filter(
                    (DBFriend.user_id1 == user_id0 and DBFriend.user_id2 == user_id1)
                    or (DBFriend.user_id1 == user_id1 and DBFriend.user_id2 == user_id0)).update({'status': 1})
        session.commit()
    return make_response('200')


# The backend will aggregate what it thins is the best possible dashboard for the user.
@app.route('/dashboard/<topic>', methods=['GET'])
def get_dashboard_with_topic(topic):
    topic_id = session.query(DBTopic.id).filter_by(name=topic).first()
    user_id0 = 0
    try:
        user_id0 = request.headers['Account-Id']
    except:
        print("User did not specify an Account Id when performing the request!")
    skilled_users = DBUserTopicMap.query.filter_by(topic_id=topic_id).all()
    list_users = []
    for u in skilled_users:
        user = session.query(DBUser).join(DBUserTopicMap).filter(DBUser.id == u.user_id).first()
        if user is not None:
            status = session.query(DBFriend.status).join(DBUser).filter(
                (DBFriend.user_id1 == user_id0 and DBFriend.user_id2 == user.id) or (
                            DBFriend.user_id2 == user_id0 and DBFriend.user_id1 == user.id)).first()
            skills = session.query(DBTopic.name, DBUserTopicMap.expertise).join(DBUserTopicMap).filter(DBUserTopicMap.user_id == u.id).all()
            skills = [Skill(skill[0][0] + skill[0][1:].lower(), skill[1]) for skill in skills]
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
                "status": status
            }
            list_users.append(profile_json)
    list_users = list_users[:15]
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
    skills = session.query(DBTopic.name, DBUserTopicMap.expertise).join(DBUserTopicMap).filter(DBUserTopicMap.user_id == user.id).all()
    skills = [Skill(skill[0][0] + skill[0][1:].lower(), skill[1]) for skill in skills]
    print(profile_id)
    print('user', user.id)
    output_user = User(user.id, user.first_name, user.last_name, user.date_of_birth, user.institution, user.description, user.profile_pic, token_0, skills, user.money)
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
                'id': friend.id,
                'first': friend.first_name,
                'last': friend.last_name,
                'subject': subject.name

            } for friend, subject in friends_left]
        });

# Creates a new vault account
@app.route('/send-money', methods=['PUT', 'POST'])
def send_money():

    user_account_id = None
    user_send_to_id = None
    money_amount = 0

    data = request.get_json()

    print(data)
    try:
        user_account_id = request.headers['Account-Id']
        print(user_account_id)
    except:
        print("User did not specify an Account Id when performing the request!")
        return "User did not specify an Account Id when performing the request!", 401

    #try:
    user_send_to_id = int(data['Send-To-Account-Id'])
    print(user_send_to_id)
    #except:
    #    print("User did not specify an Account Id to send money to when performing the request!")
    #    return "User did not specify an Account Id to send money to when performing the request!", 401

    try:
        money_amount = int(data['Money'])
        print(money_amount)
    except:
        print("Money not specified!")
        return "Money not specified", 401


    user_from = DBUser.query.filter_by(id=user_account_id).first()
    if user_from == None:
        return "Could not get user", 401

    user_to = DBUser.query.filter_by(id=user_send_to_id).first()
    if user_to == None:
        return "Could not get user", 401

    if user_from.money < money_amount or money_amount < 0:
        return "Cannot afford to pay", 401

    user_from.money -= money_amount
    user_to.money += money_amount

    db.session.add(user_from)
    db.session.add(user_to)
    db.session.commit()

    return "Successfully exchanged money", 200

# Vault integration:

# Creates a new vault account
# @app.route('/create_account/<id>', methods=['GET'])
#def create_vault_account(id):
#    return jsonify({'customer': vault_client.customers.create_customer(customer_id=id)})


# Creates a new vault account
#@app.route('/create_customer_account/<id>', methods=['GET'])
#def create_vault_account(id):
#    return jsonify({'account': vault_client.accounts.create_account(account_id=id)})


# Runs the app:
if __name__ == '__main__':
    app.run(debug=True)
