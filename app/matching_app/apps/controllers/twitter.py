
class TwitterManager(object):
    @staticmethod
    def get_user_url(user_name:str) -> str:
        base_url = "https://twitter.com/"
        return "{}{}".format(base_url, user_name)

    @staticmethod
    def get_tweet_url(user_name:str, tweet_id:str) -> str:
        base_url = "https://twitter.com/"
        return "{}{}/status/{}".format(base_url, user_name, tweet_id)
