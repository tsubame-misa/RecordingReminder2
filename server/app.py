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
import re

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
    print(data["artist"])

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


@app.route('/get_user_notification', methods=['GET'])
def get_user_noti():
    session = create_session()
    user_id = "1"
    data = session.query(User).filter_by(id=user_id).first()
    # data = [d.to_json() for d in data]
    data = data.to_json()
    session.close()
    return jsonify(data['noti_time'])


@app.route('/change_notification', methods=['PUT'])
def change_notification():
    session = create_session()
    user_id = "1"

    data = json.loads(request.data.decode())
    print(data)

    user = session.query(User).filter_by(id=user_id).first()
    preNoti = user.notification_time
    preNotiList = re.split('[/:]', preNoti)
    newNoti = ""
    if data['date'] == None:
        newNoti = preNotiList[0]+"/"+data['time']
    elif data['time'] == None:
        newNoti = data['date']+"/"+preNotiList[1]+":"+preNotiList[2]
    else:
        newNoti = data['date']+"/"+data['time']

    user.notification_time = newNoti
    session.add(user)
    session.commit()
    session.close()

    return 'received'


@app.route('/get_user_list/<id>', methods=['GET'])
def get_user_program(id):
    session = create_session()
    user_id = "1"
    data = session.query(UserTvLIst).filter_by(user_id=user_id, id=id).first()
    # data = [d.to_json() for d in data]
    data = data.to_json()
    artistList = re.split('[}{,]', data["artist"])
    data["artist"] = artistList[1:-1]
    session.close()
    return jsonify(data)


@app.route('/change_user_tv_program/<id>', methods=['PUT'])
def change_user_tv_program(id):
    session = create_session()
    user_id = "1"

    data = json.loads(request.data.decode())
    print(data)

    user = session.query(UserTvLIst).filter_by(user_id=user_id, id=id).first()
    user.channel = data["channel"]
    user.name = data['name']
    user.date = data['date']
    user.artist = data['artist']
    user.start_time = data['startTime']
    user.end_time = data['endTime']
    user.comment = data['comment']
    print(user.to_json())

    session.add(user)
    session.commit()
    session.close()

    print(type(user))

    return "hello"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
