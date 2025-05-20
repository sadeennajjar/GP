from flask import Flask
app = Flask(__name__)

@app.route('/routes')
def routes():
    return "Routes endpoint is working!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4000)
