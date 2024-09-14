###
# test server that returns a json with
# a rabdom number calculated at time of request
# aswell as the timestemp for when that number was generated
# way to interact with mobile app
###

# Import flask
from flask import Flask, session, make_response,request, Blueprint, url_for
from flask_session import Session
from cachelib.file import FileSystemCache
from autodoc import Autodoc
import datetime
import os
 
#app definintion
from cfg import *

#import API Feaatures
import API.Accounts as APIlogin
import API.Session as APIsession
import API.Notifications as APINotifications
import API.UserReport as APIUserReport
import API.Sync as APISync
import API.Relationships as APIRelationships

#addin externals
app.register_blueprint(APIlogin.login_routes)
app.register_blueprint(APIsession.session_routes)
app.register_blueprint(APIUserReport.userreport_routes)
app.register_blueprint(APINotifications.notifications_routes)
app.register_blueprint(APISync.sync_routes)
app.register_blueprint(APIRelationships.relationships_routes)

#Session
SESSION_TYPE = 'cachelib'
SESSION_SERIALIZATION_FORMAT = 'json'
SESSION_CACHELIB = FileSystemCache(threshold=500, cache_dir=f"{os.path.dirname(__file__)}/sessions")

app.config.from_object(__name__)

# Initiate the session
Session(app)
auto = Autodoc(app) 

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

# root route
@app.route('/')
def root_route():
    # Returning data through api
    time_stamp = datetime.datetime.now()
    return make_response({
        'Intro':"Welcome to FloodHelp API", 
        "Current Time":time_stamp
    })

# This route generates HTML of documentation 
@app.route('/documentation') 
def documentation(): 
    return auto.html() 



def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

@app.route("/site-map")
def site_map():
    links = []
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            links.append((url, rule.endpoint))
    # links is now a list of url, endpoint tuples

# Running app
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)