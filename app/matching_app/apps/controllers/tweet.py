from matching_app.apps.models.db import *  # noqa


class TweetManager(object):
    @staticmethod
    def get_tweets(user_id: str = None, tweet_ids: list = None) -> list:
        tweets = None
        with session_scope() as session:
            if user_id:
                tweets = session.query(
                    Tweet.text
                ).filter(
                    Tweet.twitter_user_id == user_id
                ).all()
            elif tweet_ids:
                tweets = session.query(
                    Tweet
                ).filter(
                    Tweet.tweet_id.in_(tweet_ids)
                ).all()
        return tweets

    def save_tweets(self, tweets: list) -> None:
        with session_scope() as session:
            session.bulk_save_objects(tweets)
            session.commit()

