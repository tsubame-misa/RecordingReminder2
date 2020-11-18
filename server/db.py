import os
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from models import Base

engine = sqlalchemy.create_engine(os.environ.get('DATABASE_URL'))
Session = sessionmaker(bind=engine)


def create_session():
    return Session()


if __name__ == '__main__':
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
