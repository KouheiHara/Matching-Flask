from flask import request
from cerberus import Validator  # noqa
from flask_jwt_extended import (
    JWTManager, get_jwt_identity, verify_jwt_in_request, get_raw_jwt
)  # noqa
from matching_app import app  # noqa
from matching_app.apps.common.error import AuthorizationFailureError  # noqa


jwt = JWTManager(app)


class Auth(object):
    schemas = {
        'request': {
            'username': {
                'type': 'string',
                'required': True,
                'empty': False
            }
        }
    }

    def authorize(self, req):
        try:
            verify_jwt_in_request()
            return req.get('username') == get_jwt_identity()
        except Exception as e:
            app.logger.warning('Token authorized Error: {}'.format(e))
            return False

    def req_init(self):
        req = request.form
        schema = self.schemas.get('request')

        v = Validator(allow_unknown=True)
        if not v.validate(req, schema):
            raise ValueError(v.errors)

        if not self.authorize(req):
            raise AuthorizationFailureError('Authentication Error')
