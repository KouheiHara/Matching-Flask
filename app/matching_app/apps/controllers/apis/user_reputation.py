import traceback
from matching_app import app  # noqa
from matching_app.apps.models.db import *  # noqa
from matching_app.apps.controllers.user import UserManager  # noqa
from matching_app.apps.controllers.apis.auth import Auth  # noqa
from matching_app.apps.controllers.apis.post import Post  # noqa


class CheckLike(Post, Auth):
    def post(self):
        try:
            self.req_init()
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

    def main(self):
        value = self.get_value(["user_id", "like", "check"])
        error = None
        with session_scope() as session:
            try:
                um = UserManager(session)
                um.update_reputation(
                    value["user_id"],
                    bool(int(value["like"])),
                    bool(int(value["check"]))
                )
                session.commit()
            except Exception as e:
                error = e
        if error:
            raise error
