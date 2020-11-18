from db import create_session
from models import User


def main():
    session = create_session()
    user = User()
    session.add(user)
    session.commit()
    """
    musics = [Music(user_id=user.id, name="music") for _ in range(5)]
    session.add_all(musics)
    session.commit()
    #folder = Folder(name="フォルダ1", user_id=user.id, folder_id=1)
    folder = Folder(name="フォルダ1", user_id=user.id)

    session.add(folder)
    session.commit()
    """


if __name__ == '__main__':
    main()
