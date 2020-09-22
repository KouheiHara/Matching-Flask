import traceback
from flask import request, make_response
from flask_restful import Resource
from matching_app import app  # noqa
from matching_app.apps.services.create_csv import create_csv, get_rid_of_new_line  # noqa
from matching_app.apps.services.sqlalchemy_util import convert_query_to_dict_list  # noqa
from matching_app.apps.controllers.user import UserManager  # noqa
from matching_app.apps.controllers.keyword import KeywordManager  # noqa
from matching_app.apps.controllers.tweet import TweetManager  # noqa


class UserInfo(Resource):
    def get(self):
        try:
            data = self.main()
            return {
                'status': "true",
                'message': '',
                'data': data
            }
        except Exception as e:
            app.logger.error("{}".format(traceback.format_exc()))
            return {
                'status': "false",
                'message': "{}".format(e),
                'data': {}
            }

    def _get_user_id(self):
        return request.args.get('user_id')

    def main(self):
        user_id = self._get_user_id()
        data = {}
        if user_id is not None:
            data = UserManager.get_user_info(user_id)
        return data


class UserCsv(UserInfo):
    def get(self):
        try:
            return self.main()
        except Exception as e:
            raise e

    def create_csv_response(self, filename: str, csv_data: str):
        res = make_response()
        res.data = csv_data
        res.headers['Content-Type'] = 'text/csv'
        res.headers['Content-Disposition'] = 'attachment; filename=' + filename
        return res

    def main(self):
        user_id = self._get_user_id()
        row_datas = []
        if user_id is not None:
            row_datas.append(UserManager.get_user_info(user_id))
            tweets = TweetManager.get_tweets(
                user_id=user_id
            )
            tweet_keys = [
                "text",
                "tweet_url",
                "retweet_count",
                "favorite_count"]
            tweets = convert_query_to_dict_list(tweets, tweet_keys)
            tweets = [{"text": get_rid_of_new_line(t["text"])} for t in tweets]
            row_datas.extend(tweets)
            data = create_csv(row_datas)
            download_filename = user_id + '.csv'
            return self.create_csv_response(download_filename, data)
        else:
            return None
