from flask import jsonify, request
from flask import render_template
from flask_jwt_extended import create_access_token  # noqa
from matching_app import app  # noqa


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/user/<user_id>')
def user(user_id):
    return render_template("user.html")


@app.route('/auth', methods=["POST"])
def auth():
    username = request.form.get('username')
    password = request.form.get('password')
    if not username or not password:
        return jsonify({"message": "Format does not match"}), 400

    # ユーザログイン機能はまだなし
    # 有効期限も今の所は無期限
    token = create_access_token("anonymous", expires_delta=False)
    return jsonify(access_token=token, username="anonymous"), 200
