import json
import datetime
import urllib.request
from abc import ABCMeta, abstractmethod
from requests_oauthlib import OAuth1Session
from matching_app import app  # noqa
from matching_app.apps.common.error import *  # noqa
from matching_app.apps.models.db import *  # noqa
from matching_app.apps.controllers.twitter import TwitterManager  # noqa
from matching_app.apps.controllers.user import UserManager  # noqa
from matching_app.apps.controllers.tweet import TweetManager  # noqa


class TwitterApiManager(metaclass=ABCMeta):
    @abstractmethod
    def _oauth_v1(self) -> None:
        # https://api.twitter.com/oauth2/tokenへのアクセス
        self.twitter = OAuth1Session(
            app.config.get("CONSUMER_KEY"),
            app.config.get("CONSUMER_SECRET_KEY"),
            app.config.get("API_KEY"),
            app.config.get("API_SECRET_KEY"))

    @abstractmethod
    def _request(self, url: str, params: dict) -> dict:
        req = self.twitter.get(url, params=params)
        if req.status_code == 200:
            res = json.loads(req.text)
            return res
        else:
            raise APIError("APIの接続エラー {}".format(req.text))

    @abstractmethod
    def get_data(self) -> None:
        pass


class SearchTweetApi(TwitterApiManager, TwitterManager):
    SEARCH_URL = 'https://api.twitter.com/1.1/search/tweets.json'

    def __init__(self) -> None:
        self.__params = {
            "q": "",
            "count": 100,
            "lang": "ja"
        }

    @property
    def params(self):
        return self.__params

    def _oauth_v1(self) -> None:
        return super()._oauth_v1()

    def _request(self, url: str, params: str) -> dict:
        self._oauth_v1()
        return super()._request(url, params)

    def get_data(self, keyword: str) -> list:
        url = self.SEARCH_URL
        self.__params["q"] = keyword
        data = self._request(url, self.__params)
        ex_data = self._extract_tweets(data)
        return self._save_and_refer_data(ex_data)

    def _save_and_refer_data(self, datas: list) -> list:
        users = UserManager.get_all_user()

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
                        twitter_user_name=data["user_name"],
                        icon_url=data["icon_url"]
                    )
                )
            new_datas.append(data)
            new_datas_user_id.append(data["user_id"])

        if len(save_datas) > 0:
            um = UserManager()
            um.save_users(save_datas)

        return new_datas

    def _extract_tweets(self, res: dict) -> list:
        datas = []
        for line in res['statuses']:
            data = {
                "datetime": line["created_at"],
                "tweet_id": line["id_str"],
                "text": line["text"],
                "retweet_count": line["retweet_count"],
                "user_id": line["user"]["screen_name"],
                "user_name": line["user"]["name"],
                "user_description": line["user"]["description"],
                "user_url":  self.get_user_url(line["user"]["screen_name"]),
                "tweet_url": self.get_tweet_url(line["user"]["screen_name"], line["id_str"]),
                "icon_url": line["user"]["profile_image_url_https"],
                "like": 0,
                "dislike": 0,
            }
            datas.append(data)
        return datas


class SearchUserTimelineApi(TwitterApiManager, TwitterManager):
    SEARCH_URL = 'https://api.twitter.com/1.1/statuses/user_timeline.json'

    def __init__(self) -> None:
        self.__params = {
            "screen_name": "",
            "count": 100,
        }

    @property
    def params(self):
        return self.__params

    def _oauth_v1(self) -> None:
        return super()._oauth_v1()

    def _request(self, url: str, params: str) -> dict:
        self._oauth_v1()
        return super()._request(url, params)

    def get_data(self, user_id: str) -> list:
        url = self.SEARCH_URL
        self.__params["screen_name"] = user_id
        data = self._request(url, self.__params)
        ex_data = self._extract_tweets(data)
        return self._save_and_refer_data(ex_data)

    def _save_and_refer_data(self, datas: list) -> list:
        tweet_ids = [data["tweet_id"] for data in datas]
        already_tweets = TweetManager.get_tweets(
            tweet_ids=tweet_ids)
        save_datas = []
        already_tweet_ids = [
            already_tweet.tweet_id for already_tweet in already_tweets]
        for ind, data in enumerate(datas):
            if data["tweet_id"] in already_tweet_ids:
                tweet = already_tweets[already_tweet_ids.index(
                    data["tweet_id"])]
                tweet.retweet_count = data["retweet_count"]
                tweet.favorite_count = data["favorite_count"]
                save_datas.append(tweet)
            else:
                save_datas.append(
                    Tweet(
                        twitter_user_id=data["user_id"],
                        tweet_id=data["tweet_id"],
                        text=data["text"],
                        retweet_count=data["retweet_count"],
                        favorite_count=data["favorite_count"],
                        tweet_url=data["tweet_url"]
                    )
                )
        if len(save_datas) > 0:
            tm = TweetManager()
            tm.save_tweets(save_datas)
        return datas

    def _extract_tweets(self, res: dict) -> list:
        datas = []
        for line in res:
            data = {
                "datetime": line["created_at"],
                "tweet_id": line["id_str"],
                "text": line["text"],
                "retweet_count": line["retweet_count"],
                "favorite_count": line["favorite_count"],
                "user_id": line["user"]["screen_name"],
                "tweet_url": self.get_tweet_url(line["user"]["screen_name"], line["id_str"]),
            }
            datas.append(data)
        return datas


class UserSearchApi(TwitterApiManager, TwitterManager):
    SEARCH_URL = 'https://api.twitter.com/1.1/users/search.json'

    def __init__(self) -> None:
        self.__params = {
            "q": "",
            "count": 20,
        }

    @property
    def params(self):
        return self.__params

    def _oauth_v1(self) -> None:
        return super()._oauth_v1()

    def _request(self, url: str, params: str) -> dict:
        self._oauth_v1()
        return super()._request(url, params)

    def get_data(self, user_id: str) -> list:
        url = self.SEARCH_URL
        self.__params["q"] = user_id
        data = self._request(url, self.__params)
        ex_data = self._extract_tweets(data)
        return self._save_and_refer_data(ex_data)

    def _save_and_refer_data(self, datas: list) -> list:
        users = UserManager.get_all_user()

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
                        twitter_user_name=data["user_name"],
                        icon_url=data["icon_url"]
                    )
                )
            new_datas.append(data)
            new_datas_user_id.append(data["user_id"])

        if len(save_datas) > 0:
            um = UserManager()
            um.save_users(save_datas)

        return new_datas

    def _extract_tweets(self, res: dict) -> list:
        datas = []
        for line in res:
            data = {
                "user_id": line["screen_name"],
                "user_name": line["name"],
                "user_description": line["description"],
                "user_url":  self.get_user_url(line["screen_name"]),
                "icon_url": line["profile_image_url_https"],
                "like": 0,
                "dislike": 0,
            }
            datas.append(data)
        return datas
