#flask + general
from flask import Flask, session, make_response,request, Blueprint
from flask_session import Session
import os
import base64

#for password encryption
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

login_routes = Blueprint("login_routes", __name__)

#switch this to actually user database
accounts =	{}


@login_routes.route("/account/login", methods = ['POST'])
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

@login_routes.route("/account/create", methods = ['POST'])
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
    
@login_routes.route('/login/test')
def get_data():
    # Returning data through api
    value = "calcualte_test_values()"
    time_stamp = "datetime.datetime.now()"
    return {
        'Requested':"data", 
        "Time_stamp":time_stamp, 
        "Value":value
    }
