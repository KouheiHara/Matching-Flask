from matching_app.apps.models.db import *  # noqa
from matching_app.apps.models.twitter import *  # noqa


class TweetManager(object):
    def __init__(self, session):
        self.session = session

    def get_tweets(self, user_id: str = None, tweet_ids: list = None) -> list:
        if user_id:
            filter_args = [Tweet.twitter_user_id == user_id]
        elif tweet_ids:
            filter_args = [Tweet.tweet_id.in_(tweet_ids)]
        tweets = self.session.query(
            Tweet
        ).filter(
            *filter_args
        ).all()
        return tweets

    def save_tweets(self, tweets: list) -> None:
        self.session.bulk_save_objects(tweets)
