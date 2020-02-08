import sqlalchemy
import datetime
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime
from sqlalchemy.orm import backref, relationship, session
from flask_cors import CORS

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
    subject_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=False, unique=True)
    subject = relationship('User', back_populates=__tablename__)


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

@app.route('/test', methods=['GET'])
def test():
    return "API works! :D"

# Runs the app:
if __name__ == '__main__':
    app.run(debug=True)
