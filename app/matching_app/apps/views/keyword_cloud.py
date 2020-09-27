import traceback
from matching_app import app  # noqa
from matching_app.apps.controllers.keyword import KeywordManager  # noqa
from matching_app.apps.views.auth import Auth  # noqa
from matching_app.apps.views.post import Post  # noqa


class KeywordCloud(Post, Auth):
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
        km = KeywordManager()
        data = km.get_and_save_keyword_cloud(value["user_id"])
        return data
