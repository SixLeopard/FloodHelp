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

encoding = 'utf-8'

session_username_mappings = {}

def verify_user_account(username, session):
    try:
        if session_username_mappings[username].decode() == session.decode():
            return True
        else:
            return False
    except:
        return False

def create_account(name: str, email: str, password: str):
    #try:
    #set up encryption allocation and generate salt for user
    salt = os.urandom(16)
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(),length=32,salt=salt,iterations=480000)

    #generate the passkey by encoding the password
    passkey = base64.urlsafe_b64encode(kdf.derive(password.encode()))

    database_interface.create_user(name, email, passkey, salt)

    return name, email, passkey, salt
    #except:
    #    print("datebase error")
    #    return(None,None,None,None)

def login(email: str, password):
    #try:
    # tuple (uid, name, email, verified, password_hash, password_salt)
    uid, name, username, verified, verf_password, salt = database_interface.get_user(email)
    #set up encryption allocation and get saved salt for user
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(),length=32,salt=salt,iterations=480000)
    #generate the passkey by encoding the password
    passkey = base64.urlsafe_b64encode(kdf.derive(password.encode()))

    #check to see if username and password match
    if passkey == verf_password: #is pas
        #generate session key
        sessionkey = Fernet(passkey).encrypt(uuid.uuid4().bytes)
        return (sessionkey, username, uid)
    else:
        print("user submitted invalid password")
        return (None,None,None)
    #except:
    #    print("datebase error")
    #    return(None,None,None)
        

@login_routes.route("/accounts/login", methods = ['POST'])
def login_route():
    '''
        Route for user Logins

        Form Data:
            email -> User Email
            password -> User Password
        
        Return:
            Json containing if the login was completed
            denoted by login: True oor Login: False if it failed
            in additon if the login was succsessful
            the sessionid
    '''
    if request.method == 'POST':
        #get uername and password from api call
        username = request.form.get('email')
        password = request.form.get('password')
        if (username != None or password != None):
            sessionkey,username,uid = login(username, password)

            if (sessionkey != None or username != None or password != None):

                #assign session id and username
                session['id'] = sessionkey
                session['username'] = username
                session["uid"] = uid 

                #setup active username to session key mapping
                session_username_mappings[session['username']] = session['id']

                #return the session id on succesful login
                return make_response({"Login":"True", "sessionid":f"{session['id']}"})
            else:
                #if login fails
                return make_response({"Login":"False"})
        else:
            return make_response({"Login":"False"})
    
    return make_response({"Login":"login mut be completed through POST request"})

@login_routes.route("/accounts/create", methods = ['POST'])
def create_route():
    '''
        Form Data:
            name -> Users Fullname
            email -> User Email
            password -> User Password
        
        Return:
            Json containing if the creation was
            completed by created : True or 
            created: False if it was unsuccsesful
            in additon if th eaccount creation
            was completed then also returns
            the username and encrypted password
    '''
    if request.method == 'POST':
        #get uername and password from api call
        name = request.form.get('name')
        username = request.form.get('email')
        password = request.form.get('password')

        name, email, passkey, salt = create_account(name, username, password)
        if name != None or email != None or passkey != None or salt != None:
            return make_response({"created":"True","username":f"{username}","passkey":f"{passkey}"})
        else:
            return make_response({"created":"False"})
    
@login_routes.route('/accounts/test', methods = ['GET'])
def test_route():
    '''
        route to test if accounts route is working

        Form Data:
            takes nothing
        
        Return:
            time stamp + some other test output
        
    '''
    # Returning data through api
    value = "calcualte_test_values()"
    time_stamp = "datetime.datetime.now()"
    return {
        'Requested':"data", 
        "Time_stamp":time_stamp, 
        "Value":value
    }
