from matching_app.app import api, app  # noqa
import matching_app.apps.controllers.apis  # noqa
from matching_app.apps.controllers.apis.search_list import SearchList  # noqa
from matching_app.apps.controllers.apis.user_list import UserList  # noqa
from matching_app.apps.controllers.apis.user_reputation import CheckLike  # noqa
from matching_app.apps.controllers.apis.search_user import SearchUser  # noqa
from matching_app.apps.controllers.apis.keyword_cloud import KeywordCloud  # noqa
from matching_app.apps.controllers.apis.user_info import UserInfo, UserCsv  # noqa


api.add_resource(SearchList, '/api/search_list')
api.add_resource(CheckLike, '/api/check_like')
api.add_resource(SearchUser, '/api/search_user')
api.add_resource(KeywordCloud, '/api/keyword_cloud')
api.add_resource(UserInfo, '/api/user_info')
api.add_resource(UserCsv, '/api/user_csv')
api.add_resource(UserList, '/api/user_list')
