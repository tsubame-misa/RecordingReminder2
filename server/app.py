import io
import os
from flask import Flask, jsonify, request, make_response, g
from flask_cors import CORS, cross_origin
from db import create_session
from models import User, TvLIst, UserTvLIst, UserNotification
import numpy as np
import requests
from collections import OrderedDict
import json
import datetime
from sqlalchemy.sql import func
from jose import jwt
import urllib
from functools import wraps
import sys
import sqlalchemy.exc
import re
import datetime

app = Flask(__name__)
#cors = CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})


###認証#########################
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header():
    """Obtains the access token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    #auth = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilo5MEdBb0JIb05raldLOE0tWVJ5eiJ9.eyJpc3MiOiJodHRwczovL3JlY29yZGluZy1yZW1pbmRlci51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWZiNmY5NzFlNDM3OWEwMDc2N2YyODU4IiwiYXVkIjpbImh0dHBzOi8vcmVyZSIsImh0dHBzOi8vcmVjb3JkaW5nLXJlbWluZGVyLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2MDU4ODc3OTcsImV4cCI6MTYwNTk3NDE5NywiYXpwIjoiclZwWDJmY1lTaGozaURSc2VpQUhlTlFvSVBaV1NWY3QiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.XJa2KKMtU3WNxK5z8yqiK22vYZ0HhCEg2tWQfkRXIdmYUmYJc4dqpCmss5Aangfnoqn5GGL_L2fbuoDu0yS8OU74RB0NntGFhJu33ef_910YLkXAqgkj1KBM-1HXvKTH7hZ72t7rqq6Z9Iw0fINQo9_1hX4SnZ5wHzFbyWIAxNmxodFr3N4opWvFk9itAkd3Xy9mHO3vMnw2RqP_BfpU7dgjW6vVP3jkyNhbSQ-tC0KvoJb9HKxxWaULbMPbD_ZbhqQy27sm_auXV45ffytHtsRhdYOsikFVyqOJCrbXFffMAcPlwUQmp7oNUJNeNmWMQg-sktnfmcrnkEQpOsSdlw'

    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                         "description":
                         "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must start with"
                         " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                         "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must be"
                         " Bearer token"}, 401)

    token = parts[1]
    return token


def requires_auth(f):
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urllib.request.urlopen(
            # "https://recording-reminder.us.auth0.com/.well-known/jwks.json")
            "https://auth.vdslab.jp/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = key
        # print(rsa_key)
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,

                    algorithms=['RS256'],
                    audience="https://blooming-coast-85852.herokuapp.com",
                    issuer="https://auth.vdslab.jp/"
                    # issuer="https://recording-reminder.us.auth0.com/"
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                 "description": "token is expired"}, 401)
            except jwt.JWTClaimsError:
                raise AuthError({"code": "invalid_claims",
                                 "description":
                                 "incorrect claims,"
                                 "please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                 "description":
                                 "Unable to parse authentication"
                                 " token."}, 400)

            g.current_user = payload
            # print("-----------")
            # print(payload)
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                         "description": "Unable to find appropriate key"}, 400)
    return decorated


################################


@app.route('/api/add_tv_list', methods=['PUT'])
@requires_auth
def add_tv_list():
    session = create_session()
    user_id = g.current_user['sub']
    data = json.loads(request.data.decode())
    date = datetime.datetime.strptime(data["date"], '%Y-%m-%dT%H:%M:%S.000Z')
    stime = None
    if data["startTime"] != None:
        stime = datetime.datetime.strptime(
            data["startTime"], '%Y-%m-%dT%H:%M:%S.%f%z')
    etime = None
    if data["endTime"] != None:
        etime = datetime.datetime.strptime(
            data["endTime"], '%Y-%m-%dT%H:%M:%S.%f%z')

    add_tv_list = UserTvLIst(user_id=user_id, channel=data['channel'], date=date, name=data['name'],
                             artist=data['artist'], start_time=stime, end_time=etime, comment=data['comment'], check=0)
    session.add(add_tv_list)

    all_t = session.query(TvLIst).filter_by().all()
    same = False
    for i in range(len(all_t)):  # ダブりがあったら追加しない
        if all_t[i].date == data["date"] and all_t[i].channel == data['channel']:
            same = True
            break

    if same == False:
        share_list = TvLIst(channel=data['channel'], date=date, name=data['name'],
                            artist=data['artist'], start_time=stime, end_time=etime, comment=data['comment'], creater=user_id)
        session.add(share_list)

    session.add(add_tv_list)
    session.commit()
    session.close()

    return jsonify(1)


@app.route('/api/get_user_list', methods=['GET'])
@requires_auth
def get_user_list():
    session = create_session()
    user_id = g.current_user['sub']
    # get user list
    user_t = session.query(User).all()
    user_list = list(user_t[i].id for i in range(len(user_t)))
    # print(user_list)
    registered = False
    # check registerd
    for _id in user_list:
        if _id == user_id:
            registered = True
            break
    # register
    if registered == False:
        u = User(id=user_id, notification_allow=1)
        session.add(u)
        session.commit()
        user_noti = UserNotification(user_id=user_id, time="pre/20:00")
        session.add(user_noti)
        session.commit()

    data = session.query(UserTvLIst).filter_by(user_id=user_id).all()
    data = [d.to_json() for d in data]
    # print(data)
    #data = OrderedDict(data)
    # print(data)
    session.close()
    return jsonify(data)


@app.route('/api/get_all_list', methods=['GET'])
@requires_auth
def get_all_list():
    session = create_session()
    user_id = g.current_user['sub']
    data = session.query(TvLIst).all()
    data = [d.to_json() for d in data if d.creater != user_id]
    session.close()
    return jsonify(data)


@app.route('/api/get_user_notification', methods=['GET'])
@requires_auth
def get_user_noti():
    session = create_session()
    user_id = g.current_user['sub']
    data = session.query(UserNotification).filter_by(user_id=user_id).all()
    # = session.query(User).filter_by(id=user_id).first()
    data = [d.to_json() for d in data]
    print(data)
    #data = data.to_json()
    session.close()
    print(data[0]['time'])
    return jsonify(data[0]['time'])


@app.route('/api/change_notification', methods=['PUT'])
@requires_auth
def change_notification():
    session = create_session()
    user_id = g.current_user['sub']

    data = json.loads(request.data.decode())
    print(data)

    user = session.query(UserNotification).filter_by(user_id=user_id).first()
    preNoti = user.time
    preNotiList = re.split('[/:]', preNoti)
    newNoti = ""
    if data['date'] == None:
        newNoti = preNotiList[0]+"/"+data['time']
    elif data['time'] == None:
        newNoti = data['date']+"/"+preNotiList[1]+":"+preNotiList[2]
    else:
        newNoti = data['date']+"/"+data['time']
    print(newNoti)
    user.time = newNoti
    session.add(user)
    session.commit()
    session.close()

    return 'received'


@app.route('/api/get_user_list/<id>', methods=['GET'])
@requires_auth
def get_user_program(id):
    session = create_session()
    user_id = g.current_user['sub']
    data = session.query(UserTvLIst).filter_by(user_id=user_id, id=id).first()
    # data = [d.to_json() for d in data]
    data = data.to_json()
    artistList = re.split('[}{,]', data["artist"])
    data["artist"] = artistList[1:-1]
    session.close()
    return jsonify(data)


@app.route('/api/change_user_tv_program/<id>', methods=['PUT'])
@requires_auth
def change_user_tv_program(id):
    session = create_session()
    user_id = g.current_user['sub']

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

    session.add(user)
    session.commit()
    session.close()
    return "resive"


@app.route('/api/delete_user_program_list/<id>', methods=['DELETE'])
@requires_auth
def delete_user_program_list(id):
    session = create_session()
    user_id = g.current_user['sub']
    session.query(UserTvLIst).filter_by(
        user_id=user_id, id=id).delete()
    session.commit()
    session.close()
    return get_user_list()


@app.route('/api/get_user_id', methods=['GET'])
@requires_auth
def get_user_id():
    session = create_session()
    user_id = g.current_user['sub']
    return jsonify(user_id)


@app.route('/api/put_my_list/<id>', methods=['PUT'])
@requires_auth
def put_my_list(id):
    session = create_session()
    user_id = g.current_user['sub']

    data = session.query(TvLIst).filter_by(id=id).first()
    data = data.to_json()

    user_t = session.query(UserTvLIst).filter_by(user_id=user_id).all()
    for i in range(len(user_t)):  # ダブりがあったら追加しない
        if user_t[i].date == data["date"] and user_t[i].channel == data['channel']:
            return "resive"

    print(data)
    toMyList = UserTvLIst(user_id=user_id, channel=data['channel'], date=data['date'], name=data['name'],
                          artist=data['artist'], start_time=data['start_time'], end_time=data['end_time'], comment=data['comment'], check=0)

    session.add(toMyList)
    session.commit()
    session.close()

    return "resive"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
