###
# test server that returns a json with
# a rabdom number calculated at time of request
# aswell as the timestemp for when that number was generated
# way to interact with mobile app
###

# Import flask
from flask import Flask, session, make_response,request, Blueprint
from flask_session import Session
from cachelib.file import FileSystemCache
import datetime
import os
 
#import externals
import API.Login as APIlogin
import API.Session as APIsession
import API.Notifications as APINotifications

# Initializing flask app
app = Flask(__name__)
 
#addin externals
app.register_blueprint(APIlogin.login_routes)
app.register_blueprint(APIsession.session_routes)
app.register_blueprint(APINotifications.notifications_routes)

#Session
SESSION_TYPE = 'cachelib'
SESSION_SERIALIZATION_FORMAT = 'json'
SESSION_CACHELIB = FileSystemCache(threshold=500, cache_dir=f"{os.path.dirname(__file__)}/sessions")

app.config.from_object(__name__)

# Initiate the session
Session(app)

# Route for seeing a data
@app.route('/test')
def get_data():
    # Returning data through api
    value = "test"
    time_stamp = datetime.datetime.now()
    return {
        'Requested':"data", 
        "Time_stamp":time_stamp, 
        "Value":value
    }

# Running app
if __name__ == '__main__':
    app.run(debug=True)