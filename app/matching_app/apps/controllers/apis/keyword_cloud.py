import traceback
from matching_app import app  # noqa
from matching_app.apps.models.db import *  # noqa
from matching_app.apps.controllers.keyword import KeywordManager  # noqa
from matching_app.apps.controllers.apis.auth import Auth  # noqa
from matching_app.apps.controllers.apis.post import Post  # noqa


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
        data = []
        error = None
        first_commit = False
        with session_scope() as session:
            try:
                km = KeywordManager(session)
                data, morph_data = km.get_and_save_morphological_text(
                    value["user_id"])
                session.commit()
                morphological_text = morph_data["morphological_text"]
                session.refresh(morphological_text)
                morphological_id = morphological_text.id
                first_commit = True
            except Exception as e:
                error = e

            if first_commit:
                try:
                    km.update_cloud_keyword(
                        value["user_id"],
                        morph_data["combined_text"],
                        morphological_id,
                        morph_data["words"],
                        morph_data["total"])
                    session.commit()
                except Exception as e:
                    error = e
                    self.km.rollback_morphological_text()
                    session.commit()

        if not error:
            return data
        else:
            raise error
