from matching_app.apps.models.db import *


class UserManager(object):
    @staticmethod
    def update_reputation(user_id:str, like:bool, plus:bool) -> None:
        with session_scope() as session:
            user = session.query(
                User
            ).filter(
                User.twitter_user_id==user_id 
            ).first()
            cor = -1
            if plus:
                cor = 1
            if like:
                user.like += cor
            else:
                user.dislike += cor
            session.add(user)
            session.commit()
