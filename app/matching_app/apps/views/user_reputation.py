import traceback
from flask import request
from flask_restful import Resource
from matching_app import app
from matching_app.apps.controllers.user import UserManager


class CheckLike(Resource):
    def get(self):
        try:
            self.main()
            return {
                'status': "true",
                'message': '',
            }
        except Exception as e:
            app.logger.error("{}".format(traceback.format_exc()))
            return {
                'status': "false",
                'message': "{}".format(e),
            }

    def _get_user_id(self):
        return (
            request.args.get('user_id'),
            bool(int(request.args.get('like'))),
            bool(int(request.args.get('check'))),
        )

    def main(self):
        user_id, like, check = self._get_user_id()
        um = UserManager()
        um.update_reputation(user_id, like, check)
