import os
from flask import Flask
from logging import StreamHandler, FileHandler, Formatter
from flask.logging import default_handler
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

environment="development"
if os.getenv('FLASK_ENV') is not None:
    environment = os.getenv('FLASK_ENV')

app.config.from_object('matching_app.config.'+environment.capitalize())

app.logger.setLevel(app.config["LOG_LEVEL"])

app.logger.removeHandler(default_handler)

handler =StreamHandler()
if app.config["LOG_LOG_PATH"] != "":
    handler =FileHandler(app.config["LOG_LOG_PATH"])

handler_format = Formatter(
    '[%(asctime)s] %(levelname)s %(filename)s(%(lineno)d): %(message)s'
)
handler.setFormatter(handler_format)
handler.setLevel(app.config['LOG_LEVEL'])
app.logger.addHandler(handler)


import matching_app.apps.views
from matching_app.apps.views.search_list import SearchList
from matching_app.apps.views.user_reputation import CheckLike
from matching_app.apps.views.search_user import SearchUser
from matching_app.apps.views.keyword_cloud import KeywordCloud
from matching_app.apps.views.user_info import UserInfo


api.add_resource(SearchList, '/api/search_list')
api.add_resource(CheckLike, '/api/check_like')
api.add_resource(SearchUser, '/api/search_user')
api.add_resource(KeywordCloud, '/api/keyword_cloud')
api.add_resource(UserInfo, '/api/user_info')
