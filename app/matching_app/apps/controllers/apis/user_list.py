import traceback
from matching_app import app  # noqa
from matching_app.apps.models.db import *  # noqa
from matching_app.apps.controllers.twitter_api import UserSearchApi  # noqa
from matching_app.apps.controllers.apis.auth import Auth  # noqa
from matching_app.apps.controllers.apis.post import Post  # noqa


class UserList(Post, Auth):
    def post(self):
        try:
            self.req_init()
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
        value = self.get_value(["user_id"])
        data = []
        error = None
        with session_scope() as session:
            try:
                twitter = UserSearchApi()
                data = twitter.get_save_data(session, value["user_id"])
                session.commit()
            except Exception as e:
                error = e
        if not error:
            return data
        else:
            raise error
