import json
import datetime
import urllib.request
from abc import ABCMeta, abstractmethod
from requests_oauthlib import OAuth1Session
from matching_app import app
from matching_app.apps.common.error import *
from matching_app.apps.models.db import *


class ApiManager(metaclass=ABCMeta):
    @abstractmethod
    def _oauth_v1(self) -> None:
        #https://api.twitter.com/oauth2/tokenへのアクセス
        self.twitter = OAuth1Session(
            app.config.get("CONSUMER_KEY"),
            app.config.get("CONSUMER_SECRET_KEY"),
            app.config.get("API_KEY"),
            app.config.get("API_SECRET_KEY"))

    @abstractmethod
    def _request(self, url:str, params:dict) -> dict:
        req = self.twitter.get(url, params=params)
        if req.status_code == 200:
            res = json.loads(req.text)
            return res
        else:
            raise APIError("APIの接続エラー {}".format(req.text))

    @abstractmethod
    def get_data(self) -> None:
        pass

    def _get_user_url(self, user_name:str) -> str:
        #https://twitter.com/HotChotto
        base_url = "https://twitter.com/"
        return "{}{}".format(base_url, user_name)

    def _get_tweet_url(self, user_name:str, tweet_id:str) -> str:
        #https://twitter.com/HotChotto/status/1294810842727235584
        base_url = "https://twitter.com/"
        return "{}{}/status/{}".format(base_url, user_name, tweet_id)


class SearchTweetApi(ApiManager):
    SEARCH_URL = 'https://api.twitter.com/1.1/search/tweets.json'
    def __init__(self) -> None:
        self.params = {
            "q": "",
            "count": 100,
            "lang": "ja"
        }

    def _oauth_v1(self):
        return super()._oauth_v1()

    def _request(self, url:str, params:str):
        self._oauth_v1()
        return super()._request(url, params)

    def get_data(self, keyword:str):
        url = self.SEARCH_URL
        self.params["q"] = keyword
        data = self._request(url, self.params)
        ex_data = self._extract_tweets(data)
        return self._save_and_refer_data(ex_data)

    def _save_and_refer_data(self, datas:list) -> list:
        users = None
        with session_scope() as session:
            users = session.query(
                User.twitter_user_id,
                User.twitter_user_name,
                User.like,
                User.dislike
            ).filter().all()

        user_ids = [user.twitter_user_id for user in users]
        new_datas = []
        new_datas_user_id = []
        save_datas = []
        for data in datas:
            if data["user_id"] in new_datas_user_id:
                continue

            if data["user_id"] in user_ids:
                index = user_ids.index(data["user_id"])
                data["like"] = users[index].like
                data["dislike"] = users[index].dislike
            else:
                save_datas.append(
                    User(
                        twitter_user_id=data["user_id"],
                        twitter_user_name=data["user_name"]
                    )
                )
            new_datas.append(data)
            new_datas_user_id.append(data["user_id"])

        if len(save_datas) > 0:
            with session_scope() as session:
                session.bulk_save_objects(save_datas)
                session.commit()
        
        return new_datas

    def _extract_tweets(self, res:dict) -> list:
        datas = []
        for line in res['statuses']:
            data = {
                "datetime": line["created_at"],
                "tweet_id": line["id_str"],
                "text": line["text"],
                "retweet_count": line["retweet_count"],
                "user_id": line["user"]["screen_name"],
                "user_name": line["user"]["name"],
                "user_profile_image": line["user"]["profile_image_url_https"],
                "user_description": line["user"]["description"],
                "user_url": self._get_user_url(line["user"]["screen_name"]),
                "tweet_url": self._get_tweet_url(line["user"]["screen_name"], line["id_str"]),
                "icon_url": line["user"]["profile_image_url_https"],
                "like": 0,
                "dislike": 0,
            }
            datas.append(data)
        return datas

# twitter = SearchTweetApi()
# data = twitter.get_data("吃音")