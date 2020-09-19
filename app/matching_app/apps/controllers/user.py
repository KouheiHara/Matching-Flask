from matching_app.apps.models.db import *
from matching_app.apps.controllers.twitter import TwitterManager


class UserManager(object):
    def update_reputation(self, user_id:str, like:bool, plus:bool) -> None:
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
    
    @staticmethod
    def get_user_info(user_id:str) -> dict:
        user = None
        with session_scope() as session:
            user = session.query(
                User
            ).filter(
                User.twitter_user_id==user_id 
            ).first()
        user_dict = {}
        if user:
            user_dict["user_id"] = user.twitter_user_id
            user_dict["user_name"] = user.twitter_user_name
            user_dict["user_url"] = TwitterManager.get_user_url(user.twitter_user_id)
            user_dict["icon_url"] = user.icon_url
            user_dict["like"] = user.like
            user_dict["dislike"] = user.dislike
        return user_dict

    @staticmethod
    def get_all_user() -> list:
        users = None
        with session_scope() as session:
            users = session.query(
                User.twitter_user_id,
                User.twitter_user_name,
                User.like,
                User.dislike,
                User.icon_url
            ).filter().all()
        return users
    
    def save_users(self, users: list) -> None:
        with session_scope() as session:
            session.bulk_save_objects(users)
            session.commit()