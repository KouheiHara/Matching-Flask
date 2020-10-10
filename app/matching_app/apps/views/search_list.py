import traceback
from matching_app import app  # noqa
from matching_app.apps.controllers.twitter_api import SearchTweetApi  # noqa
from matching_app.apps.views.auth import Auth  # noqa
from matching_app.apps.views.post import Post  # noqa


class SearchList(Post, Auth):
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
        value = self.get_value(["keyword"])
        data = []
        if "keyword" in value.keys():
            #twitter = SearchTweetApi()
            #data = twitter.get_data(value["keyword"])
            data = [{"keyword": test}]
        return data
