###
# test server that returns a json with
# a rabdom number calculated at time of request
# aswell as the timestemp for when that number was generated
# way to interact with mobile app
###

# Import flask
from flask import Flask, session, make_response,request
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from flask_session import Session
from cachelib.file import FileSystemCache
import base64
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

#switch this to actually user database
accounts =	{}

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


@app.route("/account/login", methods = ['GET','POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username in accounts:
            salt = accounts[username][1]
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=480000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
            if key == accounts[username][2]:
                session['id'] = accounts[username][0]
                return make_response({"Login":"True",
                                    "sessionid":f"{session['id']}"
                                    })
        return make_response({"Login":"False"
                                })

@app.route("/account/create", methods = ['GET','POST'])
def create():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        salt = os.urandom(16)
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=480000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        sessionkey = Fernet(key).encrypt(username.encode())
        if username not in accounts:
            session['id'] = key
            accounts[username] = [sessionkey,salt,key]
            return make_response({"created":"True",
                                "username":f"{username}",
                                "passkey":f"{sessionkey}"
                                })
        return make_response({"created":"False"
                                })

     
# Running app
if __name__ == '__main__':
    app.run(debug=True)