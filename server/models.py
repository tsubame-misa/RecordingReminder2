import pytz
from sqlalchemy import Column, Integer, ForeignKey, LargeBinary, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
import datetime


Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Text, primary_key=True, server_default="1")
    notification_time = Column(Text, server_default="pre/20:00")  # Datetime?

    def to_json(self):
        return {
            'id': self.id,
            'noti_time': self.notification_time
        }


class TvLIst(Base):
    __tablename__ = 'tv_list'

    id = Column(Integer, primary_key=True)
    channel = Column(Text)
    date = Column(Text)  # Datetimeにするかどうか
    name = Column(Text)
    artist = Column(Text)  # 番号にするか名前にするか
    start_time = Column(Text)  # Datetimeにするかどうか
    end_time = Column(Text)
    comment = Column(Text)

    def to_json(self):
        return {
            'id': self.id,
            'channel': self.channel,
            'date': self.date,
            'name': self.name,
            'artist': self.artist,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'comment': self.comment
        }


class UserTvLIst(Base):
    __tablename__ = 'user_tv_list'

    id = Column(Integer, primary_key=True)
    user_id = Column(Text, ForeignKey('users.id'))
    channel = Column(Text)
    date = Column(Text)  # Datetimeにするかどうか
    name = Column(Text)
    artist = Column(Text)  # 番号にするか名前にするか
    start_time = Column(Text)  # Datetimeにするかどうか
    end_time = Column(Text)
    comment = Column(Text)
    check = Column(Integer)

    def to_json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'channel': self.channel,
            'date': self.date,
            'name': self.name,
            'artist': self.artist,
            'startTime': self.start_time,
            'endTime': self.end_time,
            'comment': self.comment,
            'check': self.check
        }
