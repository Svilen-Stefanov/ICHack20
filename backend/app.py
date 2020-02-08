import sqlalchemy
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/test', methods=['GET'])
def test():
    return "API works! :D"


# Runs the app:
if __name__ == '__main__':
    app.run(debug=True)
