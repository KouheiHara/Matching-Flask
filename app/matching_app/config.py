import os
from dotenv import load_dotenv  # noqa

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)


class Config(object):
    DB_DEBUG = True
    DB_POOL_RECYCLE = 60
    CLOUD_NUMS = 30

    # v2 API
    CONSUMER_KEY = os.environ.get('CONSUMER_KEY')
    CONSUMER_SECRET_KEY = os.environ.get('CONSUMER_SECRET_KEY')
    API_KEY = os.environ.get('API_KEY')
    API_SECRET_KEY = os.environ.get('API_SECRET_KEY')
    BEARER_TOKEN = os.environ.get('BEARER_TOKEN')

    # まだログイン機能はつけないので
    USERNAME = "anonymous"
    PASSWORD = "password"

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    # まだログインは機能はつけないので
    AUTHTOKEN = os.environ.get('AUTHTOKEN')


class Development(Config):
    LOG_LEVEL = 'DEBUG'
    #LOG_LOG_PATH = ''
    LOG_LOG_PATH = '/var/www/matching_app/log/app.log'

    DB_HOST = 'db'
    DB_DATABASE = os.environ.get('MYSQL_DATABASE')
    DB_USER = os.environ.get('MYSQL_USER')
    DB_PASSWORD = os.environ.get('MYSQL_PASSWORD')


class Production(Config):
    LOG_LEVEL = 'DEBUG'
    LOG_LOG_PATH = '/var/www/matching_app/log/app.log'

    DB_HOST = 'db'
    DB_DATABASE = os.environ.get('MYSQL_DATABASE')
    DB_USER = os.environ.get('MYSQL_USER')
    DB_PASSWORD = os.environ.get('MYSQL_PASSWORD')
