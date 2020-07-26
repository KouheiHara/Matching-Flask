from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'Index Page!'

@app.route('/health')
def health():
    return 'Health Check OK!!'

# if __name__ == "__main__":
#     #runメソッドでビルトインサーバーが走る
#     app.run()