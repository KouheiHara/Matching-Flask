from matching_app.apps.models.db import *  # noqa
from matching_app.apps.models.twitter import *  # noqa
from matching_app.apps.controllers.twitter import TwitterManager  # noqa


class UserManager(object):
    def __init__(self, session):
        self.session = session

    def update_reputation(self, user_id: str, like: bool, plus: bool) -> None:
        user = self.session.query(
            User
        ).filter(
            User.twitter_user_id == user_id
        ).first()
        cor = -1
        if plus:
            cor = 1
        if like:
            user.like += cor
        else:
            user.dislike += cor
        self.session.add(user)

    def get_user_info(self, user_id: str) -> dict:
        user = self.session.query(
            User
        ).filter(
            User.twitter_user_id == user_id
        ).first()
        user_dict = {}
        if user:
            user_dict["user_id"] = user.twitter_user_id
            user_dict["user_name"] = user.twitter_user_name
            user_dict["user_url"] = TwitterManager.get_user_url(
                user.twitter_user_id)
            user_dict["icon_url"] = user.icon_url
            user_dict["like"] = user.like
            user_dict["dislike"] = user.dislike
        return user_dict

    def get_all_user(self) -> list:
        users = self.session.query(
            User.twitter_user_id,
            User.twitter_user_name,
            User.like,
            User.dislike,
            User.icon_url
        ).filter().all()
        return users

    def save_users(self, users: list) -> None:
        self.session.bulk_save_objects(users)
