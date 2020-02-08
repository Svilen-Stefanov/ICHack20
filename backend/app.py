import sqlalchemy
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
# Allow Cross-origin policy on all endpoints
CORS(app)

# Database connection:
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://ffgllqemmjnrnm:c07be32cb7851a450198e43a4009a092a7c43c3678e0dc8d3ad3e309ead09669@ec2-54-246-89-234.eu-west-1.compute.amazonaws.com:5432/daahtl1du1mh0'
db = SQLAlchemy(app)

@app.route('/test', methods=['GET'])
def test():
    return "API works! :D"

# Runs the app:
if __name__ == '__main__':
    app.run(debug=True)
