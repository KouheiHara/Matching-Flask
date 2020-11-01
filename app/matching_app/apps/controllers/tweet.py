from matching_app.apps.models.db import *  # noqa
from matching_app.apps.models.twitter import *  # noqa


class TweetManager(object):
    @staticmethod
    def get_tweets(user_id: str = None, tweet_ids: list = None) -> list:
        tweets = None
        with session_scope() as session:
            if user_id:
                filter_args = [Tweet.twitter_user_id == user_id]
            elif tweet_ids:
                filter_args = [Tweet.tweet_id.in_(tweet_ids)]
            tweets = session.query(
                Tweet
            ).filter(
                *filter_args
            ).all()
        return tweets

    def save_tweets(self, tweets: list) -> None:
        with session_scope() as session:
            session.bulk_save_objects(tweets)
            session.commit()
