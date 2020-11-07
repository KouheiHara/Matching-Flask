from flask_restful import Resource
from flask import request, render_template, make_response
from matching_app import app  # noqa


class Post(Resource):
    def get(self):
        app.logger.warning(
            "Not permit GET method access {}".format(request.url))
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('post_only_404.html'), 200, headers)

    def get_value(self, keys):
        value = {}
        try:
            for key in keys:
                value[key] = request.form[key]
            return value
        except Exception as e:
            app.logger.warning(
                "Not Found API KEY Class:{} , Key: {}".format(self.__class__.__name__, key))
            raise Exception("Not Found Key")
