import traceback
from matching_app import app  # noqa
from matching_app.apps.controllers.twitter_api import UserSearchApi  # noqa
from matching_app.apps.views.auth import Auth  # noqa
from matching_app.apps.views.post import Post  # noqa


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
        if "user_id" in value.keys():
            twitter = UserSearchApi()
            data = twitter.get_data(value["user_id"])
        return data
