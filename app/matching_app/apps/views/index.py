from flask import render_template
from matching_app import app

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/user/<user_id>')
def user(user_id):
    return render_template("user.html")