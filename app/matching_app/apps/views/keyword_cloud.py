import traceback
from flask import request
from flask_restful import Resource
from matching_app import app
from matching_app.apps.controllers.keyword import KeywordManager


class KeywordCloud(Resource):
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

    def _get_user_id(self):
        return request.args.get('user_id')

    def main(self):
        user_id = self._get_user_id()
        km = KeywordManager()
        data = km.get_and_save_keyword_cloud(user_id)
        return data
