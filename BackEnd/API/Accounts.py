#flask + general
from flask import Flask, session, make_response,request, Blueprint
from flask_session import Session
import os
import base64
import uuid

#for password encryption
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from API.database import database_interface

login_routes = Blueprint("login_routes", __name__)

#switch this to actually user database
accounts =	{}

session_username_mappings = {}

def verify_user_account(username, session):
    try:
        if session_username_mappings[username].decode() == session.decode():
            return True
        else:
            return False
    except:
        return False

def create_account(name: str, email: str, passkey: str, salt: str):
    database_interface.create_user(name, email, passkey, salt)

@login_routes.route("/accounts/login", methods = ['POST'])
def login_route():
    if request.method == 'POST':
        #get uername and password from api call
        username = request.form.get('username')
        password = request.form.get('password')

        #if valid username
        if username in accounts:
            #set up encryption allocation and get saved salt for user
            salt = accounts[username][1]
            kdf = PBKDF2HMAC(algorithm=hashes.SHA256(),length=32,salt=salt,iterations=480000)

            #generate the passkey by encoding the password
            passkey = base64.urlsafe_b64encode(kdf.derive(password.encode()))

            #check to see if username and password match
            if passkey == accounts[username][0]: #**** change this to check database instead ****#
                #generate session key
                sessionkey = Fernet(passkey).encrypt(uuid.uuid4().bytes)

                #assign session id and username
                session['id'] = sessionkey
                session['username'] = username

                #setup active username to session key mapping
                session_username_mappings[session['username']] = session['id']

                #return the session id on succesful login
                return make_response({"Login":"True", "sessionid":f"{session['id']}"})
            
        #if login fails
        return make_response({"Login":"False"})

@login_routes.route("/accounts/create", methods = ['POST'])
def create_route():
    if request.method == 'POST':
        #get uername and password from api call
        name = request.form.get('name')
        username = request.form.get('username')
        password = request.form.get('password')

        #set up encryption allocation and generate salt for user
        salt = os.urandom(16)
        kdf = PBKDF2HMAC(algorithm=hashes.SHA256(),length=32,salt=salt,iterations=480000)

        #generate the passkey by encoding the password
        passkey = base64.urlsafe_b64encode(kdf.derive(password.encode()))

        #make sure user dosent already exist
        create_account(name, username, passkey, salt)
        print(database_interface.get_user(username))
        return make_response({"created":"True","username":f"{username}","passkey":f"{passkey}"})
        return make_response({"created":"False"})
    
@login_routes.route('/accounts/test', methods = ['GET'])
def test_route():
    # Returning data through api
    value = "calcualte_test_values()"
    time_stamp = "datetime.datetime.now()"
    return {
        'Requested':"data", 
        "Time_stamp":time_stamp, 
        "Value":value
    }
