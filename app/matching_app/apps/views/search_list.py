import traceback
from flask import request
from flask_restful import Resource
from matching_app import app
from matching_app.apps.controllers.twitter_api import SearchTweetApi


class SearchList(Resource):
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
                'data': []
            }

    def main(self):
        keyword = request.args.get('keyword')
        data = []
        if keyword is not None:
            twitter = SearchTweetApi()
            data = twitter.get_data(keyword)
        return data

