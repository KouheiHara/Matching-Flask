import os
from flask import Flask
from logging import StreamHandler, FileHandler, Formatter
from flask_jwt_extended import JWTManager  # noqa
from flask.logging import default_handler
from flask_restful import Resource, Api


app = Flask(__name__)
api = Api(app)
jwt = JWTManager(app)

environment = "development"
if os.getenv('FLASK_ENV') is not None:
    environment = os.getenv('FLASK_ENV')

app.config.from_object('matching_app.config.'+environment.capitalize())

app.logger.setLevel(app.config["LOG_LEVEL"])

app.logger.removeHandler(default_handler)

handler = StreamHandler()
if app.config["LOG_LOG_PATH"] != "":
    handler = FileHandler(app.config["LOG_LOG_PATH"])

handler_format = Formatter(
    '[%(asctime)s] %(levelname)s %(filename)s(%(lineno)d): %(message)s'
)
handler.setFormatter(handler_format)
handler.setLevel(app.config['LOG_LEVEL'])
app.logger.addHandler(handler)
