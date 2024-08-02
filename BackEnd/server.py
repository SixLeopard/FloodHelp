###
# test server that returns a json with
# a rabdom number calculated at time of request
# aswell as the timestemp for when that number was generated
# way to interact with mobile app
###

# Import flask
from flask import Flask, session, make_response,request
from flask_session import Session
from cachelib.file import FileSystemCache
import random as rand
import datetime
import os
 
# Initializing flask app
app = Flask(__name__)
 
#Session
SESSION_TYPE = 'cachelib'
SESSION_SERIALIZATION_FORMAT = 'json'
SESSION_CACHELIB = FileSystemCache(threshold=500, cache_dir=f"{os.path.dirname(__file__)}/sessions")

app.config.from_object(__name__)

# Initiate the session
Session(app)

# Route for seeing a data
@app.route('/poo')
def get_data():
    # Returning data through api
    value = calcualte_test_values()
    time_stamp = datetime.datetime.now()
    return {
        'Requested':"data", 
        "Time_stamp":time_stamp, 
        "Value":value
    }

@app.route("/set-session")
def set_session():
    session_id = request.args.get('session_id', None)
    session['id'] = session_id
    return make_response({"response":"id session key is set"},200)

@app.route("/get-session")
def get_session():
    return make_response({"response":f"the id is {session.get('id')}"},200)

def calcualte_test_values():
    return "hello im big"

     
# Running app
if __name__ == '__main__':
    app.run(debug=True)