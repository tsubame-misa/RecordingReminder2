import io
import os
from flask import Flask, jsonify, request, make_response, g
from flask_cors import CORS, cross_origin
from db import create_session
from models import User, TvLIst, UserTvLIst
import numpy as np
import requests
from collections import OrderedDict
import json
import datetime
from sqlalchemy.sql import func

import urllib
from functools import wraps
import sys
import sqlalchemy.exc


app = Flask(__name__)
cors = CORS(app)


@app.route('/musics', methods=['GET'])
def get_musics():
    return jsonify("hello")


@app.route('/add_tv_list', methods=['PUT'])
def add_tv_list():
    session = create_session()
    user_id = "1"
    data = json.loads(request.data.decode())
    print(data["channel"])
    print(data["date"])
    print(data["name"])

    add_tv_list = UserTvLIst(user_id=user_id, channel=data['channel'], date=data['date'], name=data['name'],
                             artist=data['artist'], start_time=data['startTime'], end_time=data['endTime'], comment=data['comment'], check=0)

    share_list = TvLIst(channel=data['channel'], date=data['date'], name=data['name'],
                        artist=data['artist'], start_time=data['startTime'], end_time=data['endTime'], comment=data['comment'])
    session.add(share_list)
    session.add(add_tv_list)
    session.commit()
    session.close()
    return 'received'


@app.route('/get_user_list', methods=['GET'])
def get_user_list():
    session = create_session()
    user_id = "1"

    data = session.query(UserTvLIst).filter_by(user_id=user_id).all()
    data = [d.to_json() for d in data]
    session.close()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
